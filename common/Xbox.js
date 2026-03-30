const { Authflow, Titles } = require("prismarine-auth");

async function XboxAPI() {
    const XboxAPI = new xboxAPI();

    await XboxAPI.getXboxAuthToken();

    return XboxAPI;
}

class xboxAPI {
  constructor() {}

  async getXboxAuthToken(relyingParty) {
    let flow = new Authflow(undefined, "./auth", {
      flow: "sisu",
      authTitle: Titles.MinecraftNintendoSwitch,
      deviceType: "Nintendo",
    }, (data) => {
      console.log(data);
      return data;
    });

    let xboxToken = await flow.getXboxToken(relyingParty);

    if (typeof xboxToken.userXUID === "string" || typeof xboxToken.userXUID === "number") this.xuid = xboxToken?.userXUID;

    /* const playfab = await flow.getPlayfabLogin();

    console.log(playfab) */

    return `XBL3.0 x=${xboxToken.userHash};${xboxToken.XSTSToken}`;
  }
}

module.exports = XboxAPI;