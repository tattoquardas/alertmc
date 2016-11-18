var http = require("http");
var fs = require("fs");
var path = require("path");
var url = require("url");
var mime = require("mime");
var nodemailer = require('nodemailer');
var pg = require('pg');
var crypto = require('crypto');
var events = require('events');
var regex = require("regex");

var emitter = new events.EventEmitter();

pg.defaults.ssl = true;

var serverSettings = {
    
    indexPage : "index.html",
    
    error404Page : "404.html",
    error400Page : "400.html",
    
    rootDirectory : "public_html",
    
    settingsDirectory : "Settings",
    
    conString : "pg://fbdfsqfaqsyfev:lGozRRrF_aCe42pGZCU1asw2c7@ec2-54-235-199-36.compute-1.amazonaws.com/d7k98vi1h94arh",
    
    emailServer : "no-reply@alertmc.com",
    
    securePages : ["admin.html"],
    
    error404Header : {
        "Content-Type" : "text/html"
    },
    
    error400Header : {
        "Content-Type" : "text/html"
    },
    
    sendFile200Header : {
        "Content-Type" : ""
    },
    
    optionsMethodHeader : {
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS"
    },
    
    availableRequests : {
        GET : {
            getForumTopicList : "Params : none",
            getSubscribers : "Params : none",
            getTopic : "Params : topic_id",
            getCommentsForTopic : "Params : topic_id",
            getPublications : "Params : none",
            getReports : "Params : none",
            getBookViewerSettings : "Params : none",
            getBookViewerSettingById : "Params : id",
            getBookViewerSettingByIdAndLang : "Params : id, lang",
            getIndexPageSettings : "Params : none",
            getPublicationsPageSettings : "Params : none",
            generateCredentials : "Params : none",
            getQuestionsForPoliglot : "Params : [level and/or lang]",
            getAnswersForPoliglot : "Params : [q_id]",
            getCalenderEvents : "Params : [event_id]",
            login : "Params : lgn, pwd, lang",
            localization : "Params : page, lang",
            getPolyglotHeaders : "Params : lang"
        },
        
        POST : {
            DataForForum : "Params : JSON object",
            DataForTopic : "Params : JSON object",
            DataForSubscribe : "Params : JSON object",
            DataForPublications : "Params : JSON object",
            DataForReports : "Params : JSON object",
            DataForBookViewer : "Params : JSON object",
            DataForCalender : "Params : JSON object",
            DataForOrder : "Params : JSON object",
            DataForPoliglot : "Params : JSON object",
            DataForPoliglotTest : "Params : JSON object",
            RegisterForEvent : "Params : JSON object",
            DataForInformationRequest : "Params : JSON object"
        }
    }
};

var sessionState = {
    
    requests : function(){
        if(this.r === undefined){
            this.r = 0;
        }
        return this.r;
    },
    
    increaseRequestCounter : function(){
        if(this.r === undefined){
            this.r = 0;
        }
        this.r++;
        return this;
    },
    
    addPoliglotSession : function(session){
        if(this.pSessions === undefined){
            this.pSessions = [];
        }
        this.pSessions.push(session);
    },
    
    removePoliglotSession : function(sessionLabel){
        if(this.pSessions !== undefined){
            var i;
            for(i=0; i<this.pSessions.length; ++i){
                if(sessionLabel === this.pSessions[i].label)
                    break;
            }
            this.pSessions.splice(i,1);
        }
    },
    
    findPoliglotSession : function(sessionLabel){
        if(this.pSessions === undefined){
            this.pSessions = [];
        }
        for(var i=0; i<this.pSessions.length; ++i){
            if(sessionLabel === this.pSessions[i].label)
                return this.pSessions[i];
        }
        return null;
    }
};

var validators = {
    validateId : function(id){
        return id.match(/^\w*$/i) != null;
    },
    
    validateName : function(name){
        return name.match(/^([a-z]|\s)*$/i) != null;
    },
    
    validateHeader : function(header){
        return header.match(/^([a-z]|\s|\d)*$/i) != null;
    }
}

var handlerUtilities = {
    randomIntInc : function(low, high) {
        return Math.floor(Math.random() * (high - low + 1) + low);
    },
    
    performQuery : function(queryString, callback){
        var client = new pg.Client(serverSettings.conString);
        client.connect();
        var query = client.query(queryString);
        query.on("row", function (row, result) {
            result.addRow(row);
        });
        query.on("end", function (result) {
            if(callback!==null){
                callback(result);
            }
            client.end();
        });
    },
    
    generateRandomHexValue : function(len){
        return crypto.randomBytes(Math.ceil(len/2)).toString('hex').slice(0,len);
    },
    
    generateRandomBase64Value : function(len){
        return crypto.randomBytes(Math.ceil(len * 3 / 4)).toString('base64').slice(0, len).replace(/\+/g, '0').replace(/\//g, '0');
    },
    
    hash : function(source){
        var h = crypto.createHash("sha512");
        return h.update(source).digest("hex");
    },
    
    sendEmail : function(recepientMail, subject, textMSG, htmlMSG){
        var transporter = nodemailer.createTransport();
        transporter.sendMail({
            from: serverSettings.emailServer,
            to: recepientMail,
            subject: subject,
            text: textMSG,
            html: htmlMSG
            }, function (err, response) {
                console.log(err || response);
        });
    },
    
    updateBookViewerData : function(pubData, repData, viewBook){
        var newViewBook = {};
        for(var i=0; i<pubData.length; ++i){
            newViewBook[pubData[i].bookId ] = {};
            if(viewBook[pubData[i].bookId ] === undefined){
                for(var j = 0; j<pubData[i]["langOptions"].length; ++j){
                    newViewBook[pubData[i].bookId ][pubData[i].langOptions[j].value] = {"shortcutIcon" : "", "title" : "", "items":[]};
                }
            } else {
                for(var j = 0; j<pubData[i].langOptions.length; ++j)
                    if(viewBook[pubData[i].bookId ][pubData[i].langOptions[j].value] === undefined){
                        newViewBook[pubData[i].bookId ][pubData[i].langOptions[j].value] = {"shortcutIcon" : "", "title" : "", "items":[]};
                    } else {
                        newViewBook[pubData[i].bookId ][pubData[i].langOptions[j].value] = viewBook[pubData[i].bookId ][pubData[i].langOptions[j].value];
                    }
            }
        }
        for(var i=0; i<repData.length; ++i){
            newViewBook[repData[i].reportId ] = {};
            if(viewBook[repData[i].reportId ] === undefined){
                for(var j = 0; j<repData[i].langOptions.length; ++j){
                    newViewBook[repData[i].reportId ][repData[i].langOptions[j].value] = {"shortcutIcon" : "", "title" : "", "items":[]};
                }
            } else {
                for(var j = 0; j<repData[i].langOptions.length; ++j)
                    if(viewBook[repData[i].reportId ][repData[i].langOptions[j].value] === undefined){
                        newViewBook[repData[i].reportId ][repData[i].langOptions[j].value] = {"shortcutIcon" : "", "title" : "", "items":[]};
                    } else {
                        newViewBook[repData[i].reportId ][repData[i].langOptions[j].value] = viewBook[repData[i].reportId ][repData[i].langOptions[j].value];
                    }
            }
        }
        return newViewBook;
    },
    
    publicationsAndReportsPostActions : function(){
        var pubDataCallback = function(result){
            var data = [];
            for(var i = 0; i<result.rows.length; ++i){
                data.push(result.rows[i]["publication_json"]);
            }
            var repDataCallback = function(result){
                var data = [];
                for(var i = 0; i<result.rows.length; ++i){
                    data.push(result.rows[i]["report_json"]);
                }
                var viewBookDataCallback = function(result){
                    var newObj = {};
                    for(var i = 0; i<result.rows.length; ++i){
                        newObj[result.rows[i]["resource_label"].split(" ").join("")] = result.rows[i]["bookviewer_json"];
                    }
                    var newBookViewer = handlerUtilities.updateBookViewerData(viewBookDataCallback.pubData, viewBookDataCallback.repData, newObj);
                    var insertCallback = function(result){
                        var key = 1;
                        for(item in insertCallback.newBookViewer){
                            handlerUtilities.performQuery("INSERT INTO public.\"BookViewer_JSON\" VALUES ('"+item+"', '"+ JSON.stringify(insertCallback.newBookViewer[item]) + "');", null);
                            key++;
                        }
                    };
                    insertCallback.newBookViewer = newBookViewer;
                    handlerUtilities.performQuery("TRUNCATE public.\"BookViewer_JSON\";", insertCallback);
                                        
                };
                viewBookDataCallback.pubData = repDataCallback.pubData;
                viewBookDataCallback.repData = data;
                handlerUtilities.performQuery("SELECT \"BookViewer_JSON\".resource_label, \"BookViewer_JSON\".bookviewer_json FROM public.\"BookViewer_JSON\";", viewBookDataCallback);
            };
            repDataCallback.pubData = data;
            handlerUtilities.performQuery("SELECT \"Reports_JSON\".report_json FROM public.\"Reports_JSON\";", repDataCallback);
        };
        handlerUtilities.performQuery("SELECT \"Publications_JSON\".publication_json FROM public.\"Publications_JSON\";", pubDataCallback);
    }
    
};

var nonstaticGetRequestHandlers = {
    
    getForumTopicList : function(request, query, req, res){
        var callback = function(result){
            callback.res.writeHead(200, {"Content-Type": "application/json"});
            callback.res.write(JSON.stringify(result.rows));
            callback.res.end();
        };
        callback.res = res;
        handlerUtilities.performQuery("SELECT \"Forum_TopicList\".topic_id,\"Forum_TopicList\".topic_name, \"Forum_TopicList\".replies, \"Forum_TopicList\".\"lastAnswer\" FROM public.\"Forum_TopicList\";", callback);
    },
    
    getSubscribers : function(request, query, req, res){
        var callback = function(result){
            callback.res.writeHead(200, {"Content-Type": "application/json"});
            callback.res.write(JSON.stringify(result.rows));
            callback.res.end();
        };
        callback.res = res;
        handlerUtilities.performQuery("SELECT \"Subscribers\".subscriber_id, \"Subscribers\".first_name, \"Subscribers\".\"last_Name\", \"Subscribers\".email FROM public.\"Subscribers\";", callback);
    },
    
    getTopic : function(request, query, req, res){
        var callback = function(result){
            callback.res.writeHead(200, {"Content-Type": "application/json"});
            callback.res.write(JSON.stringify(result.rows[0]));
            callback.res.end();
        };
        callback.res = res;
        if(validators.validateId(query.topic_id) != true){
            emitter.emit("error400", {response : res});
            return;
        }
        handlerUtilities.performQuery("SELECT * FROM public.\"Forum_TopicList\" WHERE \"Forum_TopicList\".\"topic_id\" = '" +query.topic_id+ "\';", callback);
    },
    
    getCommentsForTopic : function(request, query, req, res){
        var callback = function(result){
            callback.res.writeHead(200, {"Content-Type": "application/json"});
            callback.res.write(JSON.stringify(result.rows));
            callback.res.end();
        };
        callback.res = res;
        if(validators.validateId(query.topic_id) != true){
            emitter.emit("error400", {response : res});
            return;
        }
        handlerUtilities.performQuery("SELECT * FROM public.\"Comments\" WHERE \"Comments\".\"topic_id\" = '" +query.topic_id+ "\';", callback);
    },
    
    getPublications : function(request, query, req, res){
        var callback = function(result){
            callback.res.writeHead(200, {"Content-Type": "application/json"});
            var data = [];
            for(var i = 0; i<result.rows.length; ++i){
                data.push(result.rows[i]["publication_json"]);
            }
            callback.res.write(JSON.stringify(data));
            callback.res.end();
        };
        callback.res = res;
        handlerUtilities.performQuery("SELECT \"Publications_JSON\".publication_json FROM public.\"Publications_JSON\";", callback);
    },
    
    getReports : function(request, query, req, res){
        var callback = function(result){
            callback.res.writeHead(200, {"Content-Type": "application/json"});
            var data = [];
            for(var i = 0; i<result.rows.length; ++i){
                data.push(result.rows[i]["report_json"]);
            }
            callback.res.write(JSON.stringify(data));
            callback.res.end();
        };
        callback.res = res;
        handlerUtilities.performQuery("SELECT \"Reports_JSON\".report_json FROM public.\"Reports_JSON\";", callback);
    },
    
    getBookViewerSettings : function(request, query, req, res){
        var callback = function(result){
            callback.res.writeHead(200, {"Content-Type": "application/json"});
            var newObj = {};
            for(var i = 0; i<result.rows.length; ++i){
                newObj[result.rows[i]["resource_label"]] = result.rows[i]["bookviewer_json"];
            }
            callback.res.write(JSON.stringify(newObj));
            callback.res.end();
        };
        callback.res = res;
        handlerUtilities.performQuery("SELECT \"BookViewer_JSON\".resource_label, \"BookViewer_JSON\".bookviewer_json FROM public.\"BookViewer_JSON\";", callback);
    },
    
    getBookViewerSettingById : function(request, query, req, res){
        var callback = function(result){
            callback.res.writeHead(200, {"Content-Type": "application/json"});
            callback.res.write(JSON.stringify(result.rows[0]["bookviewer_json"]));
            callback.res.end();
        };
        callback.res = res;
        if(validators.validateId(query.id) != true){
            emitter.emit("error400", {response : res});
            return;
        }
        handlerUtilities.performQuery("SELECT \"BookViewer_JSON\".bookviewer_json FROM public.\"BookViewer_JSON\" WHERE \"BookViewer_JSON\".resource_label = '" +query.id+ "';", callback);
    },

    getBookViewerSettingByIdAndLang : function(request, query, req, res){
        var callback = function(result){
            callback.res.writeHead(200, {"Content-Type": "application/json"});
            callback.res.write(JSON.stringify(result.rows[0]["bookviewer_json"][callback.lang]));
            callback.res.end();
        };
        callback.res = res;
        callback.lang = query.lang;
        if(validators.validateId(query.id) != true){
            emitter.emit("error400", {response : res});
            return;
        }
        handlerUtilities.performQuery("SELECT \"BookViewer_JSON\".bookviewer_json FROM public.\"BookViewer_JSON\" WHERE \"BookViewer_JSON\".resource_label = '" +query.id+ "';", callback);
    },
    
    getIndexPageSettings : function(request, query, req, res){
        var filePath = serverSettings.rootDirectory + "/" + serverSettings.settingsDirectory+ "/" +"IndexPageSettings.json";
        serverSettings.sendFile200Header["Content-Type"] = getMimeType(filePath);
        res.writeHead(200, serverSettings.sendFile200Header);
        fs.createReadStream(filePath).pipe(res);
    },
    
    getPublicationsPageSettings : function(request, query, req, res){
        var filePath = serverSettings.rootDirectory + "/" + serverSettings.settingsDirectory+ "/" +"PublicationsPageSettingsCarousel.json";
        serverSettings.sendFile200Header["Content-Type"] = getMimeType(filePath);
        res.writeHead(200, serverSettings.sendFile200Header);
        fs.createReadStream(filePath).pipe(res);
    },
    
    generateCredentials : function(request, query, req, res){
        var login = handlerUtilities.generateRandomHexValue(16);
        var pwd = handlerUtilities.generateRandomBase64Value(16);
        var obj = {
            "l" : login,
            "p" : pwd
        };
        res.writeHead(200, {"Content-Type" : "application/json"});
        res.write(JSON.stringify(obj));
        res.end();
    },
   
    getQuestionsForPoliglot : function(request, query, req, res){
        var callback = function(result){
            var data = [];
            for(var i = 0; i<result.rows.length; ++i){
                if((query.level === undefined || query.level === result.rows[i].level.split(' ').join('')) && (query.lang===undefined || query.lang === result.rows[i].lang.split(' ').join(''))){
                    data.push(result.rows[i]);
                }
            }
            callback.res.writeHead(200, {"Content-Type": "application/json"});
            callback.res.write(JSON.stringify(data));
            callback.res.end();
        };
        callback.res = res;
        callback.query = query;
        handlerUtilities.performQuery("SELECT * FROM public.\"Questions_Poliglot\";", callback);        
    },
    
    getAnswersForPoliglot : function(request, query, req, res){
        var callback = function(result){
            var data = [];
            for(var i = 0; i<result.rows.length; ++i){
                if((query.q_id === undefined || query.q_id === result.rows[i].q_id.split(' ').join('')) && (query.correct === undefined || JSON.parse(query.correct) === JSON.parse(result.rows[i].correct))){
                    data.push(result.rows[i]);
                }
            }
            callback.res.writeHead(200, {"Content-Type": "application/json"});
            callback.res.write(JSON.stringify(data));
            callback.res.end();
        };
        callback.res = res;
        callback.query = query;
        handlerUtilities.performQuery("SELECT * FROM public.\"Answers_Poliglot\";", callback);        
    },
    
    getCalenderEvents : function(request, query, req, res){
        var callback = function(result){
            var data = [];
            for(var i = 0; i<result.rows.length; ++i){
                if(query.event_id === undefined || query.event_id === result.rows[i].EventId.split(' ').join('')){
                    data.push(result.rows[i].Event);
                }
            }
            callback.res.writeHead(200, {"Content-Type": "application/json"});
            callback.res.write(JSON.stringify(data));
            callback.res.end();
        };
        callback.res = res;
        callback.query = query;
        handlerUtilities.performQuery("SELECT * FROM public.\"CalenderEvents\";", callback);        
    },
    
    login : function(request, query, req, res){
        var callback = function(result){
            console.log(JSON.stringify(result.rows));
            if(result.rows[0].login === false){
                callback.res.writeHead(404, {"Content-Type" : "text/plain"});
                callback.res.write("invalid login or password");
            }
            callback.res.writeHead(200, {"Content-Type" : "application/json"});
            var label = handlerUtilities.generateRandomBase64Value(24);
            sessionState.addPoliglotSession({"label" : label, "login" : callback.lgn});
            callback.res.write(JSON.stringify({"label" : label}));
            callback.res.end();
        };
        callback.res = res;
        callback.lgn = query.lgn;
        handlerUtilities.performQuery("SELECT login('" + query.lgn + "', '" + query.pwd + "','" + query.lang + "');", callback);        
    },
    
    localization : function(request, query, req, res){
        var filePath = serverSettings.rootDirectory + "/" + serverSettings.settingsDirectory+ "/" + query.lang + "/" + query.page + ".json";
        serverSettings.sendFile200Header["Content-Type"] = getMimeType(filePath);
        if(fs.existsSync(filePath)){
            res.writeHead(200, serverSettings.sendFile200Header);
            fs.createReadStream(filePath).pipe(res);
        } else {
            emitter.emit("error404", {response : res});
        }
    },
    
    getPolyglotHeaders : function(request, query, req, res){
        var filePath = serverSettings.rootDirectory + "/" + serverSettings.settingsDirectory+ "/" + "PoliglotHeaders.json";
        if(fs.existsSync(filePath)){
            var headers = JSON.parse(fs.readFileSync(filePath).toString());
            serverSettings.sendFile200Header["Content-Type"] = getMimeType(filePath);
            res.writeHead(200, serverSettings.sendFile200Header);
            res.end(JSON.stringify(headers[query.lang]));
        } else {
            emitter.emit("error404", {response : res});
        }
    },
    
    getMethods : function(request, query, req, res){
        res.writeHead(200, {"Content-Type" : "application/json"});
        res.write(JSON.stringify(serverSettings.availableRequests));
        res.end();
    }
    
};

var postRequestHandlers = {
    DataForForum : function(query, body, req, res){
        var newTopic = JSON.parse(body);
        var callback = function(result){
            callback.res.writeHead(200, {"Content-Type" : "application/json"});
            console.log(JSON.stringify({'topicId' : callback.id}));
            callback.res.end(JSON.stringify({'topicId' : callback.id}));
        };
        callback.res = res;
        var id = handlerUtilities.randomIntInc(100000,999999);
        callback.id = id;
        if(validators.validateHeader(newTopic.topicName) != true){
            emitter.emit("error400", {response : res});
            return;
        }
        if(validators.validateName(newTopic.lastAnswer) != true){
            emitter.emit("error400", {response : res});
            return;
        }
        handlerUtilities.performQuery("INSERT INTO public.\"Forum_TopicList\" VALUES (" + id +",'"+ newTopic.topicName +"',"+ newTopic.replies +",'"+ newTopic.lastAnswer +"');", callback);        
    },
    
    DataForTopic : function(query, body, req, res){
        var newComment = JSON.parse(body);
        console.log(body);
        var callback = function(result){
            callback.res.writeHead(200);
            callback.res.end();
        };
        callback.res = res;
        handlerUtilities.performQuery("INSERT INTO public.\"Comments\" VALUES ("+newComment.topicId+",'"+ newComment.firstName+" "+newComment.lastName +"','"+ newComment.comment +"',"+ handlerUtilities.randomIntInc(100000,999999) +", '" + newComment.comment_date + "', '" + newComment.comment_time + "');", callback);
        handlerUtilities.performQuery("UPDATE public.\"Forum_TopicList\" SET \"replies\" = " + newComment.replies + ", \"lastAnswer\" = '" + newComment.firstName + " " + newComment.lastName + "' WHERE \"topic_id\" = '" + newComment.topicId + "';", null);
        
    },
    
    DataForSubscribe : function(query, body, req, res){
        var newSubscriber = JSON.parse(body);
        var callback = function(result){
            callback.res.writeHead(200);
            callback.res.end();
        };
        callback.res = res;
        handlerUtilities.performQuery("INSERT INTO public.\"Subscribers\" VALUES ("+handlerUtilities.randomIntInc(100000,999999)+",'"+ newSubscriber.firstName +"','"+ newSubscriber.lastName +"','"+ newSubscriber.email +"');", callback);
    },
    
    DataForPublications : function(query, body, req, res){
        var data = JSON.parse(body);
        var carouselData = {};
        for(var i = 0; i<data.length; ++i){
            if(carouselData[data[i].carouselSlideNumber] === undefined){
                carouselData[data[i].carouselSlideNumber] = [];
            }
            var tmp = {};
            tmp["bookId"] = data[i].carouselBookId;
            delete data[i]["carouselBookId"];
            
            tmp["image"] = data[i].carouselImage;
            delete data[i]["carouselImage"];
            
            tmp["header"] = data[i].carouselHeader;
            delete data[i]["carouselHeader"];
            
            tmp["text"] = data[i].carouselText;
            delete data[i]["carouselText"];
            
            carouselData[data[i].carouselSlideNumber].push(tmp);
            delete data[i]["carouselSlideNumber"];
        }
        //Take a look in future
        var callback = function(result){
            var insertCallback = function(result){
                handlerUtilities.publicationsAndReportsPostActions();
            };
            for(var i = 0; i<data.length; ++i){
                if(i === (data.length-1))
                    handlerUtilities.performQuery("INSERT INTO public.\"Publications_JSON\" VALUES ("+(i+1)+", '"+ JSON.stringify(data[i]) + "');", insertCallback);
                else
                    handlerUtilities.performQuery("INSERT INTO public.\"Publications_JSON\" VALUES ("+(i+1)+", '"+ JSON.stringify(data[i]) + "');", null);
            }
            callback.res.writeHead(200);
            callback.res.end();
        };
        callback.res = res;
        handlerUtilities.performQuery("TRUNCATE public.\"Publications_JSON\";", callback);
        //-------------------------
        var forCarouselSettingsFile = { "carousel" : [] };
        for (prop in carouselData){
            var arr = carouselData[prop];
            var tmp = {"inst" : []};
            for (var i = 0; i<arr.length; ++i){
                tmp["inst"].push(arr[i]);
            }
            forCarouselSettingsFile["carousel"].push(tmp);
        }
        var filePath = serverSettings.rootDirectory + "/" + serverSettings.settingsDirectory+ "/" +"PublicationsPageSettingsCarousel.json";
        fs.writeFile(filePath, JSON.stringify(forCarouselSettingsFile, null, "    "));
    },
    
    DataForReports : function(query, body, req, res){
        var data = JSON.parse(body);
        var callback = function(result){
            var insertCallback = function(result){
                handlerUtilities.publicationsAndReportsPostActions();
            };            
            for(var i = 0; i<data.length; ++i){
                if(i === (data.length-1))
                    handlerUtilities.performQuery("INSERT INTO public.\"Reports_JSON\" VALUES ("+(i+1)+", '"+ JSON.stringify(data[i]) + "');", insertCallback);                
                else
                    handlerUtilities.performQuery("INSERT INTO public.\"Reports_JSON\" VALUES ("+(i+1)+", '"+ JSON.stringify(data[i]) + "');", null);
            }
            callback.res.writeHead(200);
            callback.res.end();
        };
        callback.res = res;
        handlerUtilities.performQuery("TRUNCATE public.\"Reports_JSON\";", callback);
    },
    
    DataForBookViewer : function(query, body, req, res){
        var data = JSON.parse(body);
        var callback = function(result){
            for(item in data){
                    handlerUtilities.performQuery("INSERT INTO public.\"BookViewer_JSON\" VALUES ('"+ item + "', '" + JSON.stringify(data[item]) + "');", null);                
            }
            callback.res.writeHead(200);
            callback.res.end();
        };
        callback.res = res;
        handlerUtilities.performQuery("TRUNCATE public.\"BookViewer_JSON\";", callback);
    },
    
    DataForCalender : function(query, body, req, res){
        var data = JSON.parse(body);
        var callback = function(result){
            for(var i = 0; i<data.length; ++i){
                    handlerUtilities.performQuery("INSERT INTO public.\"CalenderEvents\" VALUES ('"+ data[i]["eventId"] + "', '" + JSON.stringify(data[i]) + "');", null);                
            }
            callback.res.writeHead(200);
            callback.res.end();
        };
        callback.res = res;
        handlerUtilities.performQuery("TRUNCATE public.\"CalenderEvents\";", callback);
    },

    DataForCredentials : function(query, body, req, res){
        var data = JSON.parse(body);
        var callback = function(result){
            callback.res.writeHead(200);
            callback.res.end();
        };
        callback.res = res;
        handlerUtilities.performQuery("INSERT INTO public.\"testUsersAndCredentials\" (login, pass, lang) VALUES ('"+ data.l + "', '" + data.p + "', '" + data.lang +"');",callback);
    },
    
    DataForOrder : function(query, body, req, res){
        console.log(body);
        var orderOBJ = JSON.parse(body);
        var orderCode = handlerUtilities.randomIntInc(10000000000, 999999999999)
        orderOBJ['orderCode'] = orderCode;
        var textMSG = "New order #" + orderCode + "\n";
        textMSG += "Client:\n";
        textMSG += "Email: " + orderOBJ.email + "\n";
        textMSG += "First name: " + orderOBJ.firstName + "\n";
        textMSG += "Last name: " + orderOBJ.lastName + "\n";
        textMSG += "VAT: " + orderOBJ.vat + "\n";
        textMSG += "Organization: " + orderOBJ.org + "\n";
        textMSG += "Phone: " + orderOBJ.phone + "\n";
        textMSG += "Invoice Country: " + orderOBJ.countryInvoice + "\n";
        textMSG += "Delivery Country: " + orderOBJ.countryDelivery + "\n";
        textMSG += "Invoice street: " + orderOBJ.streetInvoice + "\n";
        textMSG += "Delivery street: " + orderOBJ.streetDelivery + "\n";
        textMSG += "Invoice number: " + orderOBJ.numberInvoice + "\n";
        textMSG += "Delivery number: " + orderOBJ.numberDelivery + "\n";
        textMSG += "Invoice ZIP: " + orderOBJ.zipInvoice + "\n";
        textMSG += "Delivery ZIP: " + orderOBJ.zipDelivery + "\n";
        textMSG += "Invoice place: " + orderOBJ.placeInvoice + "\n";
        textMSG += "Delivery place: " + orderOBJ.placeDelivery + "\n";
        textMSG += "Comment: " + orderOBJ.comment + "\n";
        textMSG += "Books:\n";
        var htmlMSG = "<html>";
        htmlMSG += "<h1 align='center'>New order #" + orderCode + "</h1><br/>";
        htmlMSG += "<h3>Client:</h3>";
        htmlMSG += "Email: " + orderOBJ.email + "<br/>";
        htmlMSG += "First name: " + orderOBJ.firstName + "<br/>";
        htmlMSG += "Last name: " + orderOBJ.lastName + "<br/>";
        htmlMSG += "VAT: " + orderOBJ.vat + "<br/>";
        htmlMSG += "Organization: " + orderOBJ.org + "<br/>";
        htmlMSG += "Phone: " + orderOBJ.phone + "<br/>";
        htmlMSG += "Invoice Country: " + orderOBJ.countryInvoice + "<br/>";
        htmlMSG += "Delivery Country: " + orderOBJ.countryDelivery + "<br/>";
        htmlMSG += "Invoice street: " + orderOBJ.streetInvoice + "<br/>";
        htmlMSG += "Delivery street: " + orderOBJ.streetDelivery + "<br/>";
        htmlMSG += "Invoice number: " + orderOBJ.numberInvoice + "<br/>";
        htmlMSG += "Delivery number: " + orderOBJ.numberDelivery + "<br/>";
        htmlMSG += "Invoice ZIP: " + orderOBJ.zipInvoice + "<br/>";
        htmlMSG += "Delivery ZIP: " + orderOBJ.zipDelivery + "<br/>";
        htmlMSG += "Invoice Place: " + orderOBJ.placeInvoice + "<br/>";
        htmlMSG += "Delivery Place: " + orderOBJ.placeDelivery + "<br/>";
        htmlMSG += "Comment: " + orderOBJ.comment + "<br/>";
        htmlMSG += "<h3>Books:</h3>";
        for(var i=0; i<orderOBJ.books.length; ++i){
            textMSG += "" + (i+1) + ")" + "Book: " + orderOBJ.books[i].bookName + "\n";
            textMSG += "Language: " + orderOBJ.books[i].langLabel + "\n";
            textMSG += "Quantity: " + orderOBJ.books[i].quant + "\n";
            textMSG += "Price: " + orderOBJ.books[i].price + " EUR\n";
            htmlMSG += "" + (i+1) + ")" + "Book: " + orderOBJ.books[i].bookName + "<br/>";
            htmlMSG += "  Language: " + orderOBJ.books[i].langLabel + "<br/>";
            htmlMSG += "Quantity: " + orderOBJ.books[i].quant + "<br/>";
            htmlMSG += "Price: " + orderOBJ.books[i].price + " EURO's<br/>";
        }
        textMSG += "Overall price: " + orderOBJ.overallPrice + "EURO's\n";
        htmlMSG += "<b>Overall price</b>: " + orderOBJ.overallPrice + "EUR<br/>";
        htmlMSG += "</html>";
        handlerUtilities.sendEmail("bobylbohdan@gmail.com", "Alert MC book order", textMSG, htmlMSG);
        handlerUtilities.sendEmail(orderOBJ.email, "Alert MC: you made an order", textMSG, htmlMSG);
        var callback = function(result){
            callback.res.writeHead(200);
            callback.res.end(""+callback.orderID);
        };
        callback.res = res;
        callback.orderID = orderCode;
        handlerUtilities.performQuery("INSERT INTO public.\"Orders_JSON\" (order_json) VALUES (" + "'"+ JSON.stringify(orderOBJ) + "');", callback);
    },
    
    DataForPoliglot : function(query, body, req, res){
        var obj = JSON.parse(body);
        var answersCallback = function(result){
            var questionsCallback = function(result){
                for(q in questionsCallback.obj){
                    handlerUtilities.performQuery("INSERT INTO public.\"Questions_Poliglot\" (q_id, question, level, lang) VALUES ('"+ questionsCallback.obj[q].q_id + "', '" + questionsCallback.obj[q].question + "', '" + questionsCallback.obj[q].level + "', '" + questionsCallback.obj[q].lang +"');", null);
                    console.log("Question: " + JSON.stringify(questionsCallback.obj[q]));
                    for(a in questionsCallback.obj[q].answers){
                        console.log("Answer: " + JSON.stringify(questionsCallback.obj[q].answers[a].correct));
                        if(questionsCallback.obj[q].answers[a].correct === undefined)
                            questionsCallback.obj[q].answers[a].correct = false;
                        handlerUtilities.performQuery("INSERT INTO public.\"Answers_Poliglot\" (q_id, a_id, answer, correct) VALUES ('"+ questionsCallback.obj[q].answers[a].q_id + "', '" + questionsCallback.obj[q].answers[a].a_id + "', '" + questionsCallback.obj[q].answers[a].answer + "', '" + questionsCallback.obj[q].answers[a].correct +"');", null);
                    }
                }
            }
            questionsCallback.obj = answerRsCallback.obj;
            handlerUtilities.performQuery("TRUNCATE public.\"Questions_Poliglot\" CASCADE;", questionsCallback);
        }
        answersCallback.obj = obj;
        handlerUtilities.performQuery("TRUNCATE public.\"Answers_Poliglot\" CASCADE;", answersCallback);
        res.writeHead(200);
        res.end();
    },
    
    DataForPoliglotTest : function(query, body, req, res){
        var session = sessionState.findPoliglotSession(query.label);
        
        var callback = function(result){
            callback.res.writeHead(200);
            callback.res.end();
        }
        callback.res = res;
        if(session != null){
            handlerUtilities.performQuery("DELETE FROM public.\"testUsersAndCredentials\" WHERE login='" + session.login + "';", callback);
        } else {
          emitter.emit("error404", {response : res});
        }
        sessionState.removePoliglotSession(query.label);
    },
    
    RegisterForEvent : function(query, body, req, res){
        console.log(body);
        var obj = JSON.parse(body);
        //TODO
    },
    
    DataForInformationRequest : function(query, body, req, res){
        console.log(body);
        var obj = JSON.parse(body);
        //TODO
    }
};

function getFilePath(pathname){
    if(pathname === "/"){
        pathname += serverSettings.indexPage;
    }
    pathname = serverSettings.rootDirectory + pathname;
    return pathname;
}

function getMimeType(filePath){
    return mime.lookup(path.basename(filePath));
}

function serveNonStaticRequest(req, res, requestName, query){
    var body = "";
    req.on('data', function (chunk) {
        body += chunk;
    });
    req.on('end', function () {
        if(postRequestHandlers[requestName]!==undefined){
            var handler = postRequestHandlers[requestName];
            handler(query, body, req, res);
        }else if(nonstaticGetRequestHandlers[requestName]!==undefined){
           var handler = nonstaticGetRequestHandlers[requestName];
            handler(requestName, query, req, res); 
        }else{
            emitter.emit("error404", {response : res});
        }
    });
}

var handlers = {
    getStaticFileHandler : function(data){
        if(fs.existsSync(data.filePath)){
            serverSettings.sendFile200Header["Content-Type"] = getMimeType(data.filePath);
            data.response.writeHead(200, serverSettings.sendFile200Header);
            fs.createReadStream(data.filePath).pipe(data.response);
        } else {
            emitter.emit("error404", data);
        }
    },
    
    getSecuredPageHandler : function(data){
        //TODO
    },
    
    loginHandler : function(data){
        //TODO
    },
    
    sendOptionsResponseHandler : function(data){
        data.response.writeHead(200, serverSettings.optionsMethodHeader);
        data.response.end();
    },
    
    error404Handler : function(data){
        var filePath = serverSettings.rootDirectory + "/" + serverSettings.error404Page;
        data.response.writeHead(404, serverSettings.error404Header);
        fs.createReadStream(filePath).pipe(data.response);
    },
    
    executeNonStaticRequestHandler : function(data){
        var requestName = data.reqURL.pathname.split("/").pop();
        console.log(requestName);
        serveNonStaticRequest(data.request, data.response, requestName, data.reqURL.query);
    },
    
    error400Handler : function(data){
        var filePath = serverSettings.rootDirectory + "/" + serverSettings.error400Page;
        data.response.writeHead(400, serverSettings.error400Header);
        fs.createReadStream(filePath).pipe(data.response);
    }
}

var emmiterEvents = {
    getStaticFile : emitter.on("getStaticFile", handlers.getStaticFileHandler),
    getSecuredPage : emitter.on("getSecuredPage", handlers.getSecuredPageHandler),
    login : emitter.on("login", handlers.loginHandler),
    executeNonStaticRequest : emitter.on("executeNonStaticRequest", handlers.executeNonStaticRequestHandler),
    sendOptionsResponse : emitter.on("sendOptionsResponse", handlers.sendOptionsResponseHandler),
    error404 : emitter.on("error404", handlers.error404Handler),
    error400 : emitter.on("error400", handlers.error400Handler)
}

function accept(req, res){
    var requestedURL = url.parse(req.url, true);

    if(req.method !== "OPTIONS"){
        if(path.extname(getFilePath(requestedURL.pathname)) !== ""){
            emitter.emit("getStaticFile", {request:req, response:res, filePath: getFilePath(requestedURL.pathname)});
        } else {
            emitter.emit("executeNonStaticRequest", {request:req, response:res, reqURL : requestedURL});
        }
    }else{
        emitter.emit("sendOptionsResponse", {request:req, response:res});
    }
}

var server = http.createServer(accept);

var port_num = server.listen(process.env.PORT || 3000);

console.log("Server is online. Listening");
