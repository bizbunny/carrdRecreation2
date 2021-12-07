/*Used https://coffeesaplings.carrd.co/ as reference*/
/*I'm still learning JS, so this code was copied directly from the website*/
(
    /*------------------------------------------------------------------------ */
    function() {
        var on = addEventListener,$ = function(q) { 
            return document.querySelector(q) 
        },
        $$ = function(q) { 
            return document.querySelectorAll(q) 
        },
        $body = document.body,$inner = $('.inner'),
        client = (
            /*------------------------------------------------------------------------ */
            function() {
                var o = {
                    browser: 'other',browserVersion: 0,os: 'other',osVersion: 0,mobile: false,canUse: null
                },//var o
                ua = navigator.userAgent,a, i;
                a = [
                    ['firefox', /Firefox\/([0-9\.]+)/],
                    ['edge', /Edge\/([0-9\.]+)/],
                    ['safari', /Version\/([0-9\.]+).+Safari/],
                    ['chrome', /Chrome\/([0-9\.]+)/],
                    ['chrome', /CriOS\/([0-9\.]+)/],
                    ['ie', /Trident\/.+rv:([0-9]+)/]
                ];
                for (i=0; i < a.length; i++) {
                    if (ua.match(a[i][1])) {
                        o.browser = a[i][0];
                        o.browserVersion = parseFloat(RegExp.$1);break;
                    }
                }//for (i=0; i < a.length; i++)
                a = [
                    ['ios', /([0-9_]+) like Mac OS X/, function(v) { 
                        return v.replace('_', '.').replace('_', ''); 
                    }],
                    ['ios', /CPU like Mac OS X/, function(v) { 
                        return 0 
                    }],
                    ['ios', /iPad; CPU/, function(v) { return 0 }],
                    ['android', /Android ([0-9\.]+)/, null],
                    ['mac', /Macintosh.+Mac OS X ([0-9_]+)/, function(v) { 
                        return v.replace('_', '.').replace('_', ''); 
                    }],
                    ['windows', /Windows NT ([0-9\.]+)/, null],
                    ['undefined', /Undefined/, null],
                ];
                for (i=0; i < a.length; i++) {
                    if (ua.match(a[i][1])) {
                        o.os = a[i][0];
                        o.osVersion = parseFloat( a[i][2] ? (a[i][2])(RegExp.$1) : RegExp.$1 );
                        break;
                    }
                }//for (i=0; i < a.length; i++)
                if (o.os == 'mac'&& ('ontouchstart' in window)
                    && ((screen.width == 1024 && screen.height == 1366)
                    || (screen.width == 834 && screen.height == 1112)
                    || (screen.width == 810 && screen.height == 1080)
                    || (screen.width == 768 && screen.height == 1024)
                    )// && ((screen.width == 1024 && screen.height == 1366)
                )//if (o.os == 'mac'&& ('ontouchstart' in window)
                o.os = 'ios';
                o.mobile = (o.os == 'android' || o.os == 'ios');
                var _canUse = document.createElement('div');
                o.canUse = function(p) {
                    var e = _canUse.style,up = p.charAt(0).toUpperCase() + p.slice(1);
                    return (p in e|| ('Moz' + up) in e|| ('Webkit' + up) in e|| ('O' + up) in e|| ('ms' + up) in e);
                };
                return o;
            }
            /*------------------------------------------------------------------------ */
            ()),trigger = function(t) {
                    if (client.browser == 'ie') {
                        var e = document.createEvent('Event');e.initEvent(t, false, true);
                        dispatchEvent(e);
                    } 
                    else dispatchEvent(new Event(t));
                },
                cssRules = function(selectorText) {
                    var ss = document.styleSheets,a = [],
                    f = function(s) {
                        var r = s.cssRules,i;
                        for (i=0; i < r.length; i++) {
                            if (r[i] instanceof CSSMediaRule && matchMedia(r[i].conditionText).matches)(f)(r[i]); 
                            else if (r[i] instanceof CSSStyleRule && r[i].selectorText == selectorText)a.push(r[i]);
                        }
                    },x, i;
                    for (i=0; i < ss.length; i++)f(ss[i]);
                    return a;
                },
                thisHash = function() {
                    var h = location.hash ? location.hash.substring(1) : null,a;
                    if (!h)return null;
                    if (h.match(/\?/)) {
                        a = h.split('?');
                        h = a[0];
                        history.replaceState(undefined, undefined, '#' + h);
                        window.location.search = a[1];
                    }
                    if (h.length > 0&& !h.match(/^[a-zA-Z]/))
                    h = 'x' + h;
                    if (typeof h == 'string')h = h.toLowerCase();return h;
                },
                scrollToElement = function(e, style, duration) {
                    var y, cy, dy,start, easing, offset, f;
                    if (!e)y = 0; 
                    else {
                        offset = (e.dataset.scrollOffset ? parseInt(e.dataset.scrollOffset) : 0) * parseFloat(getComputedStyle(document.documentElement).fontSize);
                        switch (e.dataset.scrollBehavior ? e.dataset.scrollBehavior : 'default') {
                            case 'default':default:y = e.offsetTop + offset;break;
                            case 'center':
                                if (e.offsetHeight < window.innerHeight)y = e.offsetTop - (
                                (window.innerHeight - e.offsetHeight) / 2) + offset; 
                                else y = e.offsetTop - offset;
                                break;
                            case 'previous':
                                if (e.previousElementSibling)y = e.previousElementSibling.offsetTop + e.previousElementSibling.offsetHeight + offset; 
                                else y = e.offsetTop + offset;break;
                        }
                    }
                    if (!style)style = 'smooth';if (!duration)duration = 750;
                    if (style == 'instant') {
                        window.scrollTo(0, y);return;
                    }
                    start = Date.now();
                    cy = window.scrollY;
                    dy = y - cy;
                    switch (style) {
                        case 'linear':
                            easing = function (t) { return t };
                            break;
                        case 'smooth':
                            easing = function (t) { return t<.5 ? 4*t*t*t : (t-1)*(2*t-2)*(2*t-2)+1 };
                            break;
                    }
                    f = function() {
                        var t = Date.now() - start;
                        if (t >= duration)window.scroll(0, y); 
                        else {
                            window.scroll(0, cy + (dy * easing(t / duration)));
                            requestAnimationFrame(f);
                        }
                    };
                    f();
                },//scrollToElement = function(e, style, duration)
                scrollToTop = function() {
                    scrollToElement(null);
                },
                loadElements = function(parent) {
                    var a, e, x, i;
                    a = parent.querySelectorAll('iframe[data-src]:not([data-src=""])');
                    for (i=0; i < a.length; i++) {
                        a[i].src = a[i].dataset.src;
                        a[i].dataset.src = "";
                    }
                    a = parent.querySelectorAll('video[autoplay]');
                    for (i=0; i < a.length; i++) {
                        if (a[i].paused)a[i].play();
                    }
                    e = parent.querySelector('[data-autofocus="1"]');
                    x = e ? e.tagName : null;
                    switch (x) {
                        case 'FORM':
                            e = e.querySelector('.field input, .field select, .field textarea');
                            if (e)e.focus();
                            break;
                        default:break;
                    }
                },
                unloadElements = function(parent) {
                    var a, e, x, i;
                    a = parent.querySelectorAll('iframe[data-src=""]');
                    for (i=0; i < a.length; i++) {
                        if (a[i].dataset.srcUnload === '0')continue;
                        a[i].dataset.src = a[i].src;a[i].src = '';
                    }
                    a = parent.querySelectorAll('video');
                    for (i=0; i < a.length; i++) {
                        if (!a[i].paused)a[i].pause();
                    }
                    e = $(':focus');
                    if (e)e.blur();
                };
                window._scrollToTop = scrollToTop;
                var thisURL = function() {
                    return window.location.href.replace(window.location.search, '').replace(/#$/, '');
                };
                var getVar = function(name) {
                    var a = window.location.search.substring(1).split('&'),b, k;
                    for (k in a) {
                        b = a[k].split('=');
                        if (b[0] == name)
                            return b[1];
                    }return null;
                };
                var errors = {
                    handle: function(handler) {
                        window.onerror = function(message, url, line, column, error) {
                            (handler)(error.message);
                            return true;
                        };
                    },
                    unhandle: function() {
                            window.onerror = null;
                    }
                };
                on('load', function() {
                    setTimeout(function() {
                        $body.className = $body.className.replace(/\bis-loading\b/, 'is-playing');
                        setTimeout(function() {
                            $body.className = $body.className.replace(/\bis-playing\b/, 'is-ready');
                        }, 1000);
                    }, 100);
                });
        (
            /*------------------------------------------------------------------------ */
            function() {
                var initialSection, initialScrollPoint, initialId,header, footer, name, hideHeader, hideFooter, disableAutoScroll,h, e, ee, k,locked = false,
                doNext = function() {
                    var section;
                    section = $('#main > .inner > section.active').nextElementSibling;
                    if (!section || section.tagName != 'SECTION')return;
                    location.href = '#' + section.id.replace(/-section$/, '');
                },
                doPrevious = function() {
                    var section;section = $('#main > .inner > section.active').previousElementSibling;
                    if (!section || section.tagName != 'SECTION')return;
                    location.href = '#' + (section.matches(':first-child') ? '' : section.id.replace(/-section$/, ''));
                },
                doFirst = function() {
                    var section;section = $('#main > .inner > section:first-of-type');
                    if (!section || section.tagName != 'SECTION')return;
                    location.href = '#' + section.id.replace(/-section$/, '');
                },
                doLast = function() {
                    var section;section = $('#main > .inner > section:last-of-type');
                    if (!section || section.tagName != 'SECTION')return;
                    location.href = '#' + section.id.replace(/-section$/, '');
                },
                sections = {};
                window._next = doNext;window._previous = doPrevious;
                window._first = doFirst;window._last = doLast;
                window._scrollToTop = function() {
                    var section, id;
                    scrollToElement(null);
                    if (!!(section = $('section.active'))) {
                        id = section.id.replace(/-section$/, '');
                        if (id == 'home')id = '';
                        history.pushState(null, null, '#' + id);
                    }
                };
                if ('scrollRestoration' in history)history.scrollRestoration = 'manual';
                header = $('#header');footer = $('#footer');
                h = thisHash();
                if (h&& !h.match(/^[a-zA-Z0-9\-]+$/))h = null;
                if (e = $('[data-scroll-id="' + h + '"]')) {
                    initialScrollPoint = e;
                    initialSection = initialScrollPoint.parentElement;
                    initialId = initialSection.id;
                } 
                else if (e = $('#' + (h ? h : 'home') + '-section')) {
                    initialScrollPoint = null;
                    initialSection = e;initialId = initialSection.id;
                }
                if (!initialSection) {
                    initialScrollPoint = null;
                    initialSection = $('#' + 'home' + '-section');
                    initialId = initialSection.id;history.replaceState(undefined, undefined, '#');
                }
                name = (h ? h : 'home');
                hideHeader = name ? ((name in sections) && ('hideHeader' in sections[name]) && sections[name].hideHeader) : false;
                hideFooter = name ? ((name in sections) && ('hideFooter' in sections[name]) && sections[name].hideFooter) : false;
                disableAutoScroll = name ? ((name in sections) && ('disableAutoScroll' in sections[name]) && sections[name].disableAutoScroll) : false;
                if (header && hideHeader) {
                    header.classList.add('hidden');
                    header.style.display = 'none';
                }
                if (footer && hideFooter) {
                    footer.classList.add('hidden');
                    footer.style.display = 'none';
                }
                ee = $$('#main > .inner > section:not([id="' + initialId + '"])');
                for (k = 0; k < ee.length; k++) {
                    ee[k].className = 'inactive';
                    ee[k].style.display = 'none';
                }
                initialSection.classList.add('active');
                loadElements(initialSection);
                if (header)loadElements(header);
                if (footer)loadElements(footer);
                if (!disableAutoScroll)scrollToElement(null, 'instant');
                on('load', function() {
                    if (initialScrollPoint)scrollToElement(initialScrollPoint, 'instant');
                });
                on('hashchange', function(event) {
                    var section, scrollPoint, id, sectionHeight, currentSection, currentSectionHeight,name, hideHeader, hideFooter, disableAutoScroll,h, e, ee, k;
                    if (locked)return false;
                    h = thisHash();
                    if (h&& !h.match(/^[a-zA-Z0-9\-]+$/))return false;
                    if (e = $('[data-scroll-id="' + h + '"]')) {
                        scrollPoint = e;
                        section = scrollPoint.parentElement;
                        id = section.id;
                    } 
                    else if (e = $('#' + (h ? h : 'home') + '-section')) {
                        scrollPoint = null;
                        section = e;id = section.id;
                    } 
                    else {
                        scrollPoint = null;
                        section = $('#' + 'home' + '-section');
                        id = section.id;history.replaceState(undefined, undefined, '#');
                    }
                    if (!section)return false;
                    if (!section.classList.contains('inactive')) {
                        name = (section ? section.id.replace(/-section$/, '') : null);
                        disableAutoScroll = name ? ((name in sections) && ('disableAutoScroll' in sections[name]) && sections[name].disableAutoScroll) : false;
                        if (scrollPoint)scrollToElement(scrollPoint); 
                        else if (!disableAutoScroll)scrollToElement(null);
                        return false;
                    } 
                    else {
                        locked = true;
                        if (location.hash == '#home')history.replaceState(null, null, '#');
                        name = (section ? section.id.replace(/-section$/, '') : null);
                        hideHeader = name ? ((name in sections) && ('hideHeader' in sections[name]) && sections[name].hideHeader) : false;
                        hideFooter = name ? ((name in sections) && ('hideFooter' in sections[name]) && sections[name].hideFooter) : false;
                        disableAutoScroll = name ? ((name in sections) && ('disableAutoScroll' in sections[name]) && sections[name].disableAutoScroll) : false;
                        if (header && hideHeader) {
                            header.classList.add('hidden');
                            header.style.display = 'none';
                        }
                        if (footer && hideFooter) {
                            footer.classList.add('hidden');
                            footer.style.display = 'none';
                        }
                        currentSection = $('#main > .inner > section:not(.inactive)');
                        currentSection.classList.add('inactive');
                        currentSection.classList.remove('active');
                        currentSection.style.display = 'none';unloadElements(currentSection);
                        if (header && !hideHeader) {
                            header.style.display = '';
                            header.classList.remove('hidden');
                        }
                        if (footer && !hideFooter) {
                            footer.style.display = '';
                            footer.classList.remove('hidden');
                        }
                        section.classList.remove('inactive');
                        section.classList.add('active');
                        section.style.display = '';
                        trigger('resize');
                        loadElements(section);
                        if (scrollPoint)scrollToElement(scrollPoint, 'instant'); 
                        else if (!disableAutoScroll)scrollToElement(null, 'instant');
                        locked = false;
                    }//else
                    return false;
                });//on('hashchange', function(event)
                on('click', function(event) {
                    var t = event.target,tagName = t.tagName.toUpperCase();
                    switch (tagName) {
                        case 'IMG':
                        case 'SVG':
                        case 'USE':
                        case 'U':
                        case 'STRONG':
                        case 'EM':
                        case 'CODE':
                        case 'S':
                        case 'MARK':
                        case 'SPAN':
                            while ( !!(t = t.parentElement) )
                            if (t.tagName == 'A')
                            break;
                            if (!t)return;
                            break;
                        default:
                            break;
                    }
                    if (t.tagName == 'A'&& t.getAttribute('href').substr(0, 1) == '#'&& t.hash == window.location.hash) {
                        event.preventDefault();
                        history.replaceState(undefined, undefined, '#');
                        location.replace(t.hash);
                    }
                });//on('click', function(event) 
            }//function()
            /*------------------------------------------------------------------------ */ 
        )();
        var style, sheet, rule;
        style = document.createElement('style');
        style.appendChild(document.createTextNode(''));
        document.head.appendChild(style);
        sheet = style.sheet;
        if (client.os == 'android') {
            (function() {
                sheet.insertRule('body::after { }', 0);
                rule = sheet.cssRules[0];
                var f = function() {
                    rule.style.cssText = 'height: ' + (Math.max(screen.width, screen.height)) + 'px';
                };
                on('load', f);
                on('orientationchange', f);
                on('touchmove', f);
            })();
            $body.classList.add('is-touch');
        }//if (client.os == 'android')  
        else if (client.os == 'ios') {
            if (client.osVersion <= 11)(
                /*------------------------------------------------------------------------ */
                function() {
                    sheet.insertRule('body::after { }', 0);
                    rule = sheet.cssRules[0];
                    rule.style.cssText = '-webkit-transform: scale(1.0)';
                }
                /*------------------------------------------------------------------------ */
            )();
            if (client.osVersion <= 11)(
                /*------------------------------------------------------------------------ */
                function() {
                    sheet.insertRule('body.ios-focus-fix::before { }', 0);
                    rule = sheet.cssRules[0];
                    rule.style.cssText = 'height: calc(100% + 60px)';
                    on('focus', function(event) {
                        $body.classList.add('ios-focus-fix');
                    }, true);
                    on('blur', function(event) {
                        $body.classList.remove('ios-focus-fix');
                    }, true);
                }
                /*------------------------------------------------------------------------ */
            )();
            $body.classList.add('is-touch');
        }//else if (client.os == 'ios')  
        else if (client.browser == 'ie') {
            if (!('matches' in Element.prototype))Element.prototype.matches = (Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector);
            (
                /*------------------------------------------------------------------------ */
                function() {
                    var a = cssRules('body::before'),r;
                    if (a.length > 0) {
                        r = a[0];
                        if (r.style.width.match('calc')) {
                            r.style.opacity = 0.9999;
                            setTimeout(function() {
                                r.style.opacity = 1;
                            }, 100);
                        } 
                        else {
                            document.styleSheets[0].addRule('body::before', 'content: none !important;');
                            $body.style.backgroundImage = r.style.backgroundImage.replace('url("images/', 'url("assets/images/');
                            $body.style.backgroundPosition = r.style.backgroundPosition;
                            $body.style.backgroundRepeat = r.style.backgroundRepeat;
                            $body.style.backgroundColor = r.style.backgroundColor;
                            $body.style.backgroundAttachment = 'fixed';
                            $body.style.backgroundSize = r.style.backgroundSize;
                        }
                    }
                }
                /*------------------------------------------------------------------------ */
            )();
            (
                /*------------------------------------------------------------------------ */
                function() {
                    var t, f;
                    f = function() {
                        var mh, h, s, xx, x, i;
                        x = $('#wrapper');
                        x.style.height = 'auto';
                        if (x.scrollHeight <= innerHeight)x.style.height = '100vh';
                        xx = $$('.container.full');
                        for (i=0; i < xx.length; i++) {
                            x = xx[i];
                            s = getComputedStyle(x);
                            x.style.minHeight = '';
                            x.style.height = '';
                            mh = s.minHeight;
                            x.style.minHeight = 0;
                            x.style.height = '';
                            h = s.height;
                            if (mh == 0)continue;
                            x.style.height = (h > mh ? 'auto' : mh);
                        }
                    };
                    (f)();
                    on('resize', function() {
                        clearTimeout(t);
                        t = setTimeout(f, 250);
                    });
                    on('load', f);
                }
                /*------------------------------------------------------------------------ */
            )();
        }//else if (client.browser == 'ie')
        else if (client.browser == 'edge') {
            (function() {
                var xx = $$('.container > .inner > div:last-child'),x, y, i;for(i=0; i < xx.length; i++) {
                    x = xx[i];
                    y = getComputedStyle(x.parentNode);
                    if (y.display != 'flex'&& y.display != 'inline-flex')continue;
                    x.style.marginLeft = '-1px';
                }
            })();
        }
        if (!client.canUse('object-fit')) {
            /*------------------------------------------------------------------------ */
            (
                function() {
                    var xx = $$('.image[data-position]'),x, w, c, i, src;for (i=0; i < xx.length; i++) {
                        x = xx[i];
                        c = x.firstElementChild;
                        if (c.tagName != 'IMG') {
                            w = c;
                            c = c.firstElementChild;
                        }
                        if (c.parentNode.classList.contains('deferred')) {
                            c.parentNode.classList.remove('deferred');src = c.getAttribute('data-src');
                            c.removeAttribute('data-src');
                        } 
                        else src = c.getAttribute('src');
                        c.style['backgroundImage'] = 'url(\'' + src + '\')';
                        c.style['backgroundSize'] = 'cover';
                        c.style['backgroundPosition'] = x.dataset.position;
                        c.style['backgroundRepeat'] = 'no-repeat';
                        c.src = 'data:image/svg+xml;charset=utf8,' + escape('<svg xmlns="http://www.w3.org/2000/svg" width="1" height="1" viewBox="0 0 1 1"></svg>');
                        if (x.classList.contains('full')&& (x.parentNode && x.parentNode.classList.contains('full'))
                        && (x.parentNode.parentNode && x.parentNode.parentNode.parentNode && 
                            x.parentNode.parentNode.parentNode.classList.contains('container'))&& x.parentNode.children.length == 1) {
                            (
                                function(x, w) {
                                    var p = x.parentNode.parentNode,f = function() {
                                        x.style['height'] = '0px';
                                        clearTimeout(t);
                                        t = setTimeout(function() {
                                            if (getComputedStyle(p).flexDirection == 'row') {
                                                if (w)w.style['height'] = '100%';
                                                x.style['height'] = (p.scrollHeight + 1) + 'px';
                                            } 
                                            else {
                                                if (w)w.style['height'] = 'auto';
                                                x.style['height'] = 'auto';
                                            }
                                        }, 125);
                                    },
                                    t;
                                    on('resize', f);
                                    on('load', f);
                                    (f)();
                                }
                            )(x, w);
                        }//x.parentNode.parentNode.parentNode.classList.contains('container'))&& x.parentNode.children.length == 1)
                    }//var xx = $$('.image[data-position]'),x, w, c, i, src;for (i=0; i < xx.length; i++) 
                }//function()
            )();
            /*------------------------------------------------------------------------ */
            (
                function() {
                    var xx = $$('.gallery img'),x, p, i, src;for (i=0;
                    i < xx.length; 
                    i++) {
                        x = xx[i];
                        p = x.parentNode;
                        if (p.classList.contains('deferred')) {
                            p.classList.remove('deferred');
                            src = x.getAttribute('data-src');
                        } 
                        else src = x.getAttribute('src');
                        p.style['backgroundImage'] = 'url(\'' + src + '\')';
                        p.style['backgroundSize'] = 'cover';
                        p.style['backgroundPosition'] = 'center';
                        p.style['backgroundRepeat'] = 'no-repeat';
                        x.style['opacity'] = '0';
                    }
                }
            )();//function()
            /*------------------------------------------------------------------------ */
        }//if (!client.canUse('object-fit')) 
    }//function()
    /*------------------------------------------------------------------------ */ 
)();