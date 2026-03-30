const XboxAPI = require("./Xbox");

const headers = {
  "Accept": "*/*",
  "charset": "utf-8",
  "client-ref": "15737c809ed75cbc4a361ffa3c5c2df76ff78d42",
  "client-version": "26.10.0",
  "x-clientplatform": "Windows",
  "x-networkprotocolversion": "924",
  "content-type": "application/json",
  "user-agent": "MCPE/UWP",
  "Accept-Language": "en-US",
  "Accept-Encoding": "gzip, deflate, br",
  "Host": "pocket.realms.minecraft.net",
  "Connection": "Keep-Alive"
}

async function RealmAPI() {
  let rAPI = new realmAPI();

  await rAPI.init();

  return rAPI;
}

async function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

class realmAPI {
  constructor() {
    this.ms = 5000;
  }

  async init() {
    this.XboxAPI = await XboxAPI();
    this.authToken = await this.XboxAPI.getXboxAuthToken("https://pocket.realms.minecraft.net/");
  }

  async getRealms() {
    const response = await fetch("https://bedrock.frontendlegacy.realms.minecraft-services.net/worlds", {
      method: "GET",
      headers: {
        ...headers,
        "authorization": this.authToken,
      },
    }).catch((error) => {
      if (error) console.log("Failed to send request.", error);
    });

    switch (response.status) {
      case 200:
      case 403:
        break;
      default:
        console.log(`Error: ${response.status} ${response.statusText}`);
        return response.status;
    }

    const data = await response.json();

    return data.servers;
  }

  async getRealmIP(realmID, callback) {
    try {
      this.retryCount = 0;

      while (true) {
        const response = await fetch(`https://bedrock.frontendlegacy.realms.minecraft-services.net/worlds/${realmID}/join`, {
          method: "GET",
          headers: {
            ...headers,
            "authorization": this.authToken
          },
          timeout: AbortSignal.timeout(15000)
        });

        switch (response.status) {
          case 200:
            this.retryCount++;

            callback(this.retryCount)

            return await response.json();
          case 503:
            this.retryCount++;

            callback(this.retryCount)

            await delay(10000)
            break;
          case 403:
            return response.status;
          default:
            console.log(`Error: ${response.status} ${response.statusText}`,);
            return response.status;
        }
      }
    } catch {
      this.retryCount++;

      callback(this.retryCount)

      await delay(10000)
    }
  }

  async joinRealm(code) {
    const response = await fetch(`https://bedrock.frontendlegacy.realms.minecraft-services.net/invites/v1/link/accept/${code}`, {
      method: "POST",
      headers: {
        ...headers,
        "authorization": this.authToken,
      }
    });

    console.log(response.status)

    if (response.status !== 200) {
      console.log(`Error: ${response.status} ${response.statusText} ${await response.text()} joinRealm, ${code}`);

      return response.status;
    }

    let data = await response.json();

    return data
  }

  async leaveRealm(id) {
    const response = await fetch(`https://bedrock.frontendlegacy.realms.minecraft-services.net/invites/v1/link/accept/${code}`, {
      method: "POST",
      headers: {
        ...headers,
        "authorization": this.authToken,
      }
    });

    if (response.status !== 200) {
      console.log(`Error: ${response.status} ${response.statusText} ${await response.text()} joinRealm`);

      return response.status;
    }

    let data = await response.json();

    return data
  }

  async checkRealmState(realm) {
    if (typeof realm === "undefined") {
      console.log(`Couldn't find target, did you get kicked?`, realm);
      return process.exit(1);
    }

    let realms = await this.getRealms();

    realm = realms.find(r => r.id === realm.id);

    switch (realm.state) {
      case "CLOSED":
        console.log(`${realm.name} is closed!`);

        await delay(45000);

        return this.checkRealmState(realm);
      case "OPEN":
      default:
        console.log(`${realm.name} is open!`);

        return realm;
    }
  }

  async getRealmInfoByID(realmID) {
    const response = await fetch(`https://bedrock.frontendlegacy.realms.minecraft-services.net/worlds/${realmID}`, {
      method: "GET",
      headers: {
        ...headers,
        "authorization": this.authToken
      }
    });

    if (response.status !== 200) {
      console.log(`Error: ${response.status} ${response.statusText} ${await response.text()}, getRealmInfo`);

      return response.status;
    }

    return await response.json();
  }
}

module.exports = RealmAPI;