interface requestOptions {
    url: string;
    method: 'POST' | 'GET' | "PUT";
    headers?: any;
    body?: any;
}

interface RequestResult {
    ok: boolean;
    status: number;
    statusText: string;
    headers: string;
    data: string;
    json: <T>() => T;
}

function parseRequestResult (xhr: XMLHttpRequest): RequestResult {
    return {
        ok: xhr.status >= 200 && xhr.status < 400,
        status: xhr.status,
        statusText: xhr.statusText,
        headers: xhr.getAllResponseHeaders(),
        data: xhr.responseText,
        json: <T>() => JSON.parse(xhr.responseText) as T,
    } as RequestResult;
}

function errorResponse(
    xhr: XMLHttpRequest
): RequestResult {
    return {
        ok: false,
        status: xhr.status,
        statusText: xhr.statusText,
        headers: xhr.getAllResponseHeaders(),
        data: xhr.statusText,
        json: <T>() => JSON.parse(xhr.statusText) as T,
    } as RequestResult;
}

function Request (options: requestOptions): Promise<any> {
    const baseURL = "";
    return new Promise((resolve, reject) => {
        const {url, method, body} = options;
        
        const xhr = new XMLHttpRequest();
        xhr.onload = (e: Event) => {
            resolve(parseRequestResult(xhr));
        }

        xhr.onerror = (e) => {
          resolve(errorResponse(xhr));
        };

        xhr.ontimeout = (e) => {
          resolve(errorResponse(xhr));
        };

        xhr.open(method, baseURL + url);
        console.log('sned');
        
        if (method === 'POST' && body) {
            xhr.setRequestHeader("Content-Type", "application/json");
            xhr.send(JSON.stringify(body));
        } else if (method === "GET" && body && body.query) {
            xhr.setRequestHeader("Content-Type", "application/json");
            console.log(body);
            
            xhr.send(JSON.stringify(body));
        } else {
            xhr.send();
        }
    })
}

export default Request;