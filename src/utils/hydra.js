/** Bridge class creating two-way link between the Hydra and the frontend **/
class Bridge {
  constructor(adminOrigin) {
    this.adminOrigin = adminOrigin;
    this.token = null;
    this.init();
  }

  init() {
    if (typeof window === "undefined") {
      return;
    }

    if (window.self !== window.top) {
      window.navigation.addEventListener("navigate", (event) => {
        window.parent.postMessage(
          { type: "URL_CHANGE", url: event.destination.url },
          this.adminOrigin
        );
      });
      // Get the access token from the URL
      const url = new URL(window.location.href);
      this.token = url.searchParams.get("access_token");
      this._setTokenCookie(this.token);
    }

    window.addEventListener("message", (event) => {
      if (event.origin === this.adminOrigin) {
        if (event.data.type === "GET_TOKEN_RESPONSE") {
          this.token = event.data.token;
          this._setTokenCookie(event.data.token);
        }
      }
    });
  }
  onEditChange(callback) {
    window.addEventListener("message", (event) => {
      if (event.origin === this.adminOrigin) {
        if (event.data.type === "FORM") {
          if (event.data.data) {
            callback(event.data.data);
          } else {
            throw new Error("No form data has been sent from the adminUI");
          }
        }
      }
    });
  }
  async getToken() {
    if (this.token !== null) {
      return this.token;
    }
    return this._getTokenFromCookie();
  }

  _setTokenCookie(token) {
    const expiryDate = new Date();
    expiryDate.setTime(expiryDate.getTime() + 12 * 60 * 60 * 1000); // 12 hours


    const url = new URL(window.location.href);
    const domain = url.hostname;

    document.cookie = `auth_token=${token}; expires=${expiryDate.toUTCString()}; path=/; domain=${domain};`;
  }

  _getTokenFromCookie() {
    if (typeof document === "undefined") {
      return null;
    }
    const name = "auth_token=";
    const decodedCookie = decodeURIComponent(document.cookie);
    const cookieArray = decodedCookie.split(";");
    for (let i = 0; i < cookieArray.length; i++) {
      let cookie = cookieArray[i].trim();
      if (cookie.indexOf(name) === 0) {
        return cookie.substring(name.length, cookie.length);
      }
    }
    return null;
  }
  enableBlockClickListener() {
    document.addEventListener("click", (event) => {
      const blockElement = event.target.closest("[data-block-uid]");
      if (blockElement) {
        const blockUid = blockElement.getAttribute("data-block-uid");
        window.parent.postMessage(
          { type: "OPEN_SETTINGS", uid: blockUid },
          this.adminOrigin
        );
      }
    });
  }
}

// Export an instance of the Bridge class
let bridgeInstance = null;

/**
 * Initialize the bridge
 *
 * @param {*} adminOrigin
 * @returns new Bridge()
 */
export function initBridge(adminOrigin) {
  if (!bridgeInstance) {
    bridgeInstance = new Bridge(adminOrigin);
  }
  return bridgeInstance;
}

/**
 * Get the token from the admin
 * @returns string
 */
export async function getToken() {
  if (bridgeInstance) {
    return await bridgeInstance.getToken();
  }
  return "";
}
/**
 * Enable the frontend to listen for changes in the admin and call the callback with updated data
 * @param {*} initialData
 * @param {*} callback
 */
export function onEditChange(callback) {
  if (bridgeInstance) {
    bridgeInstance.onEditChange(callback);
  }
}

export function enableBlockClickListener() {
  if (bridgeInstance) {
    bridgeInstance.enableBlockClickListener();
  }
}
