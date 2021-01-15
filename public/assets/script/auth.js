var loggedIn = false;
var isAdmin = false;
var token;
var dbuser;

async function auth(goToLoginOnFail) {
    token = getCookie("auth");
    if (!token) return;
    const options = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'auth-token': token
        }
    };

    try {
        const response = await fetch('/api/user/auth', options);
        const json = await response.json();
        await loadUser();

        if (json.status == 200) {
            loggedIn = true;
            console.log("logged in!");
            var login = document.getElementById('login');
            login.innerHTML = "Logout";
            login.href = "";
            login.onclick = function () {
                deleteCookie("auth");
                if (goToLoginOnFail) {
                    window.location.replace("/");
                }
            }
            setupLoggin();
        } else {
            if (goToLoginOnFail) {
                window.location.replace("/login");
            }
            console.log("not logged in!");
        }
    } catch (e) {
        if(goToLoginOnFail)
        window.location.replace("/");
    }
}

async function setupLoggin() {
    if (await getIsDev()){
        addDev();
    }

    var accSub = document.getElementById('accSub');
    createLi(accSub, "/profile", "Profile");

    if (await getIsAdmin()){
        addAdmin();
    }
}

async function getIsAdmin() {
    return await getRoute("/api/user/isAdmin");
}

async function getIsDev() {
    return await getRoute("/api/user/isDev");
}

async function getRoute(link) {
    const options = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'auth-token': token
        }
    };
    const response = await fetch(link, options);
    return response.status === 200;
}

function addAdmin() {
    var menu = document.getElementById("menu");
    var adminLi = createLi(menu, "/admin", "Admin");
    var ul = createSubMenu(adminLi);
    createLi(ul, "/admin/gentoken", "Token");
}

function addDev() {
    var menu = document.getElementById("menu");
    var devs = createLi(menu, "/yukisora/devs", "Developer");
    var subMenu = createSubMenu(devs);
    createLi(subMenu, "/yukisora/devs/create", "Monster");
    createLi(subMenu, "/yukisora/devs/monsterlist", "Mosterlist");
    createLi(subMenu, "/yukisora/devs/attacklist", "Attacklist");
    createLi(subMenu, "/yukisora/devs/item", "Item");
}

function createSubMenu(vin) {
    var ul = document.createElement("ul");
    ul.setAttribute("class", "submenu");
    if (!vin[0]) {
        vin.appendChild(ul);
    } else {
        vin.children[0].insertAdjacentElement("beforebegin", ul);
    }
    return ul;
}

function createLi(vin, href, inHtml) {
    var lis = document.createElement("li");
    lis.setAttribute("class", "menu__item");

    var as = document.createElement("a");
    as.innerHTML = inHtml;
    as.setAttribute("class", "menu__link");
    as.href = href;

    lis.appendChild(as);
    if (!vin.children[0]) {
        vin.appendChild(lis);
    } else {
        vin.children[0].insertAdjacentElement("beforebegin", lis);
    }
    return lis;
}

async function loadUser(){
        const options = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'auth-token': token
            }
        };

        const response = await fetch('/api/yuki/discuser', options);
        const json = await response.json();
        this.dbuser = json.data;
}


function getCookie(name) {
    var v = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
    return v ? v[2] : null;
}

function setCookie(name, value, days) {
    var d = new Date;
    d.setTime(d.getTime() + 24 * 60 * 60 * 1000 * days);
    document.cookie = name + "=" + value + ";path=/;expires=" + d.toGMTString();
}

function deleteCookie(name) {
    setCookie(name, '', -1);
}

function isLoggedIn() {
    return loggedIn;
}