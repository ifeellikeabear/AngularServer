!function (window) {
    var SearchSpring = window.SearchSpring || function () {
        };
    window.SearchSpring = SearchSpring
}(window), function (window) {
    window.SearchSpring.Autocomplete = window.SearchSpring.Autocomplete || {}, window.SearchSpring.Autocomplete.version || (SearchSpring.Autocomplete = {
        version: "2.6.0",
        pollTimeout: null,
        activeQuery: null,
        siteId: null,
        results: null,
        boxModel: null,
        activeResult: null,
        options: {},
        userId: null,
        serverUrl: null,
        currentQuery: "",
        init: function (options) {
            var defaults = {
                queryClass: "searchspring-query",
                offsetX: 0,
                offsetY: 0,
                acHost: "autocomplete2.searchspring.net",
                marketing: !0,
                currencySymbol: "$",
                searchSuggestionsText: "Search Suggestions",
                productsText: "Products",
                seeMoreText: "See more results for",
                defaultImage: "//cdn.searchspring.net/autocomplete/missing_image.png",
                modifyQuery: null,
                searchTermCallback: null,
                itemClickCallback: null,
                modifyResults: null,
                modifyDisplay: null,
                onItemClick: null,
                onTermClick: null
            };
            options.siteId || alert("No SiteId Defined"), SearchSpring.Autocomplete.siteId = options.siteId, SearchSpring.Autocomplete.options = SearchSpring.Autocomplete.extend(defaults, options);
            var protocol;
            protocol = "https:" == document.location.protocol ? "https" : "http", SearchSpring.Autocomplete.getUserId(), SearchSpring.Autocomplete.serverUrl = protocol + "://" + SearchSpring.Autocomplete.options.acHost + "?pubId=" + SearchSpring.Autocomplete.options.siteId + "&userId=" + SearchSpring.Autocomplete.userId;
            for (var queryElements = SearchSpring.Autocomplete.getElementsByClassName(SearchSpring.Autocomplete.options.queryClass), inputSupported = SearchSpring.Autocomplete.isOnInputSupported(), i = 0; i < queryElements.length; i++)inputSupported ? queryElements[i].oninput = SearchSpring.Autocomplete.pollQuery : queryElements[i].onkeyup = SearchSpring.Autocomplete.pollQuery, queryElements[i].onkeydown = SearchSpring.Autocomplete.keyboardNavigation
        },
        isOnInputSupported: function () {
            var el = document.createElement("input");
            return el.setAttribute("oninput", "return;"), isSupported = "function" == typeof el.oninput, el = null, isSupported
        },
        keyboardNavigation: function (ev) {
            switch (ev = ev || window.event, ev.keyCode) {
                case 13:
                    SearchSpring.Autocomplete.activeResult && (ev.preventDefault ? ev.preventDefault() : (ev.returnValue = !1, ev.cancelBubble = !0), SearchSpring.Autocomplete.activeResult.onclick());
                    break;
                case 27:
                    SearchSpring.Autocomplete.results && (SearchSpring.Autocomplete.results.style.display = "none");
                    break;
                case 38:
                    ev.returnValue = !1, SearchSpring.Autocomplete.selectUp();
                    break;
                case 40:
                    SearchSpring.Autocomplete.selectDown()
            }
        },
        selectUp: function () {
            SearchSpring.Autocomplete.results && (SearchSpring.Autocomplete.activeResult ? (SearchSpring.Autocomplete.removeClass(SearchSpring.Autocomplete.activeResult, "highlight"), SearchSpring.Autocomplete.activeResult = SearchSpring.Autocomplete.activeResult.previousSibling, SearchSpring.Autocomplete.activeResult || (SearchSpring.Autocomplete.activeResult = SearchSpring.Autocomplete.results.childNodes[SearchSpring.Autocomplete.results.childNodes.length - 1]), SearchSpring.Autocomplete.hasClass(SearchSpring.Autocomplete.activeResult, "ac_title") && (SearchSpring.Autocomplete.activeResult = SearchSpring.Autocomplete.activeResult.previousSibling, SearchSpring.Autocomplete.activeResult || (SearchSpring.Autocomplete.activeResult = SearchSpring.Autocomplete.results.childNodes[SearchSpring.Autocomplete.results.childNodes.length - 1])), SearchSpring.Autocomplete.hasClass(SearchSpring.Autocomplete.activeResult, "ac_powered") && (SearchSpring.Autocomplete.activeResult = SearchSpring.Autocomplete.activeResult.previousSibling), SearchSpring.Autocomplete.addClass(SearchSpring.Autocomplete.activeResult, "highlight")) : (SearchSpring.Autocomplete.activeResult = SearchSpring.Autocomplete.results.childNodes[SearchSpring.Autocomplete.results.childNodes.length - 1], SearchSpring.Autocomplete.addClass(SearchSpring.Autocomplete.activeResult, "highlight")))
        },
        selectDown: function () {
            SearchSpring.Autocomplete.results && (SearchSpring.Autocomplete.activeResult ? (SearchSpring.Autocomplete.removeClass(SearchSpring.Autocomplete.activeResult, "highlight"), SearchSpring.Autocomplete.activeResult = SearchSpring.Autocomplete.activeResult.nextSibling, SearchSpring.Autocomplete.activeResult || (SearchSpring.Autocomplete.activeResult = SearchSpring.Autocomplete.results.childNodes[1]), SearchSpring.Autocomplete.hasClass(SearchSpring.Autocomplete.activeResult, "ac_title") && (SearchSpring.Autocomplete.activeResult = SearchSpring.Autocomplete.activeResult.nextSibling), SearchSpring.Autocomplete.hasClass(SearchSpring.Autocomplete.activeResult, "ac_powered") && (SearchSpring.Autocomplete.activeResult = SearchSpring.Autocomplete.results.childNodes[1]), SearchSpring.Autocomplete.addClass(SearchSpring.Autocomplete.activeResult, "highlight")) : (SearchSpring.Autocomplete.activeResult = SearchSpring.Autocomplete.results.childNodes[1], SearchSpring.Autocomplete.addClass(SearchSpring.Autocomplete.activeResult, "highlight")))
        },
        hasClass: function (ele, cls) {
            return ele.className.match(new RegExp("(\\s|^)" + cls + "(\\s|$)"))
        },
        addClass: function (ele, cls) {
            SearchSpring.Autocomplete.hasClass(ele, cls) || (ele.className += " " + cls)
        },
        removeClass: function (ele, cls) {
            if (SearchSpring.Autocomplete.hasClass(ele, cls)) {
                var reg = new RegExp("(\\s|^)" + cls + "(\\s|$)");
                ele.className = ele.className.replace(reg, " ")
            }
        },
        pollQuery: function (ev) {
            clearTimeout(SearchSpring.Autocomplete.pollTimeout), ev = ev || window.event, ev.keyCode < 41 && 8 != ev.keyCode || (this.value.length > 1 && this.value != SearchSpring.Autocomplete.currentQuery ? (SearchSpring.Autocomplete.activeQuery = this, SearchSpring.Autocomplete.pollTimeout = setTimeout(function () {
                var script = document.createElement("script"), query = SearchSpring.Autocomplete.activeQuery.value;
                null !== SearchSpring.Autocomplete.options.modifyQuery && "function" == typeof SearchSpring.Autocomplete.options.modifyQuery && (query = SearchSpring.Autocomplete.options.modifyQuery(query)), script.src = SearchSpring.Autocomplete.serverUrl + "&query=" + encodeURIComponent(query) + "&callback=SearchSpring.Autocomplete.buildResults", document.getElementsByTagName("head")[0].appendChild(script), SearchSpring.Autocomplete.currentQuery = SearchSpring.Autocomplete.activeQuery.value
            }, 150)) : ev.keyCode && null !== SearchSpring.Autocomplete.results && (SearchSpring.Autocomplete.results.style.display = "none"))
        },
        buildResults: function (results) {
            null !== SearchSpring.Autocomplete.options.modifyResults && "function" == typeof SearchSpring.Autocomplete.options.modifyResults && SearchSpring.Autocomplete.options.modifyResults(results);
            var query = SearchSpring.Autocomplete.activeQuery.value;
            if (null !== SearchSpring.Autocomplete.options.modifyQuery && "function" == typeof SearchSpring.Autocomplete.options.modifyQuery && (query = SearchSpring.Autocomplete.options.modifyQuery(query)), null !== SearchSpring.Autocomplete.activeQuery && query == results.query) {
                null === SearchSpring.Autocomplete.results && (SearchSpring.Autocomplete.results = document.createElement("ul"), SearchSpring.Autocomplete.results.id = "searchspring-autocomplete_results", document.getElementsByTagName("body")[0].appendChild(SearchSpring.Autocomplete.results), document.getElementsByTagName("body")[0].onclick = function () {
                    SearchSpring.Autocomplete.results.style.display = "none"
                }), SearchSpring.Autocomplete.results.style.display = "none";
                var i, position = SearchSpring.Autocomplete.getOffset(SearchSpring.Autocomplete.activeQuery), recommendedTerm = "", html = "";
                if (results.terms.length > 0) {
                    for (html += '<li class="ac_title ac_result_title">' + SearchSpring.Autocomplete.options.searchSuggestionsText + "</li>", i = 0; i < results.terms.length; i++) {
                        var stripeClass = i % 2 ? "ac_result_even" : "ac_result_odd", term = results.terms[i];
                        html += '<li class="ac_term_result ac_result ' + stripeClass + '">' + term + "</li>"
                    }
                    recommendedTerm = results.terms[0], html += "</ul>"
                } else recommendedTerm = SearchSpring.Autocomplete.activeQuery.value;
                if (results.products.length > 0)for (html += '<li class="ac_title ac_product_title">' + SearchSpring.Autocomplete.options.productsText + "</li>", i = 0; i < results.products.length; i++) {
                    var image, product = results.products[i], stripeClass = i % 2 ? "ac_result_even" : "ac_result_odd";
                    "https:" == document.location.protocol ? product.secureThumbnailImageUrl ? image = product.secureThumbnailImageUrl : product.thumbnailImageUrl && (image = product.thumbnailImageUrl.replace(/^https?:\/\/(.+)$/i, "//$1")) : image = product.thumbnailImageUrl ? product.thumbnailImageUrl : "";
                    var url = "";
                    product.url && (url = product.url), html += '<li class="ac_product_result ac_result ' + stripeClass + '"><a href="' + url + '"><div class="image"><img src="' + image + '" onerror="this.onerror=null;this.src=\'' + SearchSpring.Autocomplete.options.defaultImage + '\';" /></div><div class="info"><div class="name">' + product.name + '</div><div class="sku">' + product.sku + '</div><div class="price">' + (product.price && 0 != product.price ? SearchSpring.Autocomplete.options.currencySymbol + product.price.toFixed(2) : "") + '</div></div><div class="clear"></div></a></li>'
                }
                if (html.length > 0) {
                    SearchSpring.Autocomplete.activeResult = null, html += '<li class="ac_term_suggest" title="' + recommendedTerm.replace('"', "&quot;") + '">' + SearchSpring.Autocomplete.options.seeMoreText + " &quot;" + recommendedTerm + "&quot; &rsaquo;</li>", SearchSpring.Autocomplete.options.marketing && (html += '<li class="ac_powered"><a target="_blank" href="http://www.searchspring.net/powered-by"><img src="//cdn.searchspring.net/autocomplete/powered-white.png" /></a></li>'), SearchSpring.Autocomplete.results.innerHTML = html;
                    var termElements = SearchSpring.Autocomplete.getElementsByClassName("ac_term_result");
                    for (i = 0; i < termElements.length; i++)termElements[i].onclick = SearchSpring.Autocomplete.searchTerm;
                    var productElements = SearchSpring.Autocomplete.getElementsByClassName("ac_product_result");
                    for (i = 0; i < productElements.length; i++)productElements[i].onclick = SearchSpring.Autocomplete.findProduct;
                    var suggestElements = SearchSpring.Autocomplete.getElementsByClassName("ac_term_suggest");
                    for (i = 0; i < suggestElements.length; i++)suggestElements[i].onclick = SearchSpring.Autocomplete.suggestTerm;
                    SearchSpring.Autocomplete.results.style.top = position.top + SearchSpring.Autocomplete.options.offsetY + "px", SearchSpring.Autocomplete.results.style.left = position.left + SearchSpring.Autocomplete.options.offsetX + "px", null !== SearchSpring.Autocomplete.options.modifyDisplay && "function" == typeof SearchSpring.Autocomplete.options.modifyDisplay && SearchSpring.Autocomplete.options.modifyDisplay(SearchSpring.Autocomplete.results), SearchSpring.Autocomplete.results.style.display = "block"
                }
            }
        },
        searchTerm: function (ev) {
            null !== SearchSpring.Autocomplete.options.onTermClick && "function" == typeof SearchSpring.Autocomplete.options.onTermClick && SearchSpring.Autocomplete.options.onTermClick(this), ev && (ev.returnValue = !1);
            try {
                _gaq.push(["_trackEvent", "SearchSpring", "Autocomplete", "Search Suggestion Click", , !0])
            } catch (ga_err) {
            }
            var currentTerm = this.textContent || this.innerText, callbackVal = !0;
            null !== SearchSpring.Autocomplete.options.searchTermCallback && "function" == typeof SearchSpring.Autocomplete.options.searchTermCallback && (callbackVal = SearchSpring.Autocomplete.options.searchTermCallback(currentTerm)), callbackVal && (SearchSpring.Autocomplete.activeQuery.value = currentTerm, SearchSpring.Autocomplete.activeQuery.form && SearchSpring.Autocomplete.activeQuery.form.submit())
        },
        suggestTerm: function (ev) {
            ev && (ev.returnValue = !1);
            var tmp = document.createElement("DIV");
            tmp.innerHTML = this.title;
            try {
                _gaq.push(["_trackEvent", "SearchSpring", "Autocomplete", "Search Suggestion Click", , !0])
            } catch (ga_err) {
            }
            var currentTerm = tmp.textContent || tmp.innerText, callbackVal = !0;
            null !== SearchSpring.Autocomplete.options.searchTermCallback && "function" == typeof SearchSpring.Autocomplete.options.searchTermCallback && (callbackVal = SearchSpring.Autocomplete.options.searchTermCallback(currentTerm)), callbackVal && (SearchSpring.Autocomplete.activeQuery.value = currentTerm, SearchSpring.Autocomplete.activeQuery.form && SearchSpring.Autocomplete.activeQuery.form.submit())
        },
        findProduct: function (ev) {
            null !== SearchSpring.Autocomplete.options.onItemClick && "function" == typeof SearchSpring.Autocomplete.options.onItemClick && SearchSpring.Autocomplete.options.onItemClick(this), ev && (ev.returnValue = !1);
            try {
                _gaq.push(["_trackEvent", "SearchSpring", "Autocomplete", "Product Suggestion Click", , !0])
            } catch (ga_err) {
            }
            var callbackVal = !0;
            null !== SearchSpring.Autocomplete.options.itemClickCallback && "function" == typeof SearchSpring.Autocomplete.options.itemClickCallback && (callbackVal = SearchSpring.Autocomplete.options.itemClickCallback(this)), callbackVal && (window.location = this.firstChild.href)
        },
        getOffset: function (element) {
            var box, body = document.body, win = document.defaultView || document.parentWindow, docElem = document.documentElement;
            null === SearchSpring.Autocomplete.boxModel && (box = document.createElement("div"), box.style.paddingLeft = box.style.width = "1px", body.appendChild(box), SearchSpring.Autocomplete.boxModel = 2 == box.offsetWidth, body.removeChild(box)), box = element.getBoundingClientRect();
            var clientTop = docElem.clientTop || body.clientTop || 0, clientLeft = docElem.clientLeft || body.clientLeft || 0, scrollTop = win.pageYOffset || SearchSpring.Autocomplete.boxModel && docElem.scrollTop || body.scrollTop, scrollLeft = win.pageXOffset || SearchSpring.Autocomplete.boxModel && docElem.scrollLeft || body.scrollLeft;
            return {
                top: box.top + element.offsetHeight + scrollTop - clientTop,
                left: box.left + scrollLeft - clientLeft
            }
        },
        getElementsByClassName: function (className, tag, elm) {
            return document.getElementsByClassName ? getElementsByClassName = function (className, tag, elm) {
                elm = elm || document;
                for (var current, elements = elm.getElementsByClassName(className), nodeName = tag ? new RegExp("\\b" + tag + "\\b", "i") : null, returnElements = [], i = 0, il = elements.length; il > i; i += 1)current = elements[i], (!nodeName || nodeName.test(current.nodeName)) && returnElements.push(current);
                return returnElements
            } : document.evaluate ? getElementsByClassName = function (className, tag, elm) {
                tag = tag || "*", elm = elm || document;
                for (var elements, node, classes = className.split(" "), classesToCheck = "", xhtmlNamespace = "http://www.w3.org/1999/xhtml", namespaceResolver = document.documentElement.namespaceURI === xhtmlNamespace ? xhtmlNamespace : null, returnElements = [], j = 0, jl = classes.length; jl > j; j += 1)classesToCheck += "[contains(concat(' ', @class, ' '), ' " + classes[j] + " ')]";
                try {
                    elements = document.evaluate(".//" + tag + classesToCheck, elm, namespaceResolver, 0, null)
                } catch (e) {
                    elements = document.evaluate(".//" + tag + classesToCheck, elm, null, 0, null)
                }
                for (; node = elements.iterateNext();)returnElements.push(node);
                return returnElements
            } : getElementsByClassName = function (className, tag, elm) {
                tag = tag || "*", elm = elm || document;
                for (var current, match, classes = className.split(" "), classesToCheck = [], elements = "*" === tag && elm.all ? elm.all : elm.getElementsByTagName(tag), returnElements = [], k = 0, kl = classes.length; kl > k; k += 1)classesToCheck.push(new RegExp("(^|\\s)" + classes[k] + "(\\s|$)"));
                for (var l = 0, ll = elements.length; ll > l; l += 1) {
                    current = elements[l], match = !1;
                    for (var m = 0, ml = classesToCheck.length; ml > m && (match = classesToCheck[m].test(current.className), match); m += 1);
                    match && returnElements.push(current)
                }
                return returnElements
            }, getElementsByClassName(className, tag, elm)
        },
        getUserId: function () {
            return SearchSpring.Autocomplete.userId || (SearchSpring.Autocomplete.userId = SearchSpring.Autocomplete.readCookie("_isuid"), SearchSpring.Autocomplete.userId && 0 != SearchSpring.Autocomplete.userId.length || (SearchSpring.Autocomplete.userId = SearchSpring.Autocomplete.generateUserId(), SearchSpring.Autocomplete.createCookie("_isuid", SearchSpring.Autocomplete.userId, 365))), SearchSpring.Autocomplete.userId
        },
        generateUserId: function () {
            var r, chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz".split(""), uuid = [];
            uuid[8] = uuid[13] = uuid[18] = uuid[23] = "-", uuid[14] = "4";
            for (var i = 0; 36 > i; i++)uuid[i] || (r = 0 | 16 * Math.random(), uuid[i] = chars[19 == i ? 3 & r | 8 : r]);
            return uuid.join("")
        },
        createCookie: function (name, value, days) {
            if (days) {
                var date = new Date;
                date.setTime(date.getTime() + 24 * days * 60 * 60 * 1e3);
                var expires = "; expires=" + date.toGMTString()
            } else var expires = "";
            document.cookie = name + "=" + value + expires + "; path=/"
        },
        readCookie: function (name) {
            for (var nameEQ = name + "=", ca = document.cookie.split(";"), i = 0; i < ca.length; i++) {
                for (var c = ca[i]; " " == c.charAt(0);)c = c.substring(1, c.length);
                if (0 == c.indexOf(nameEQ))return c.substring(nameEQ.length, c.length)
            }
            return null
        },
        extend: function (destination, source) {
            for (var property in source)destination[property] = source[property];
            return destination
        }
    })
}(window);
