const RealmAPI = require("./common/Realm");

const WhitelistedRealmIDs = [31569656];

(async () => {
    const RAPI = await RealmAPI();
    //await RAPI.joinRealm("YsBPyMNfhWQu96A"); Invaild
    //await RAPI.getRealmInfo("ibVXCPheNexf4HA")

    //await RAPI.joinRealm("4HzNgpA944N_vrU"); Invaild
    //await RAPI.getRealmInfo("MfVSeCUE-LmLhpE");
    //await RAPI.getRealmInfo("igdXhLrxv6KfJjk");
    //await RAPI.getRealmInfo("DPAdsZdhRG4jmKY");
    //await RAPI.joinRealm("ZzPBH7Beb7zYhg"); Invaild
    //await RAPI.getRealmInfo("VrgnDPoUiUrgxnM");
    //await RAPI.joinRealm("fn4vsCSQ4vhLcY"); Invaild

    const realms = await RAPI.getRealms();

    for (const realm of realms) {
        if (WhitelistedRealmIDs.includes(realm.id)) continue;
        if (realm.state === "CLOSED" || realm.expired) continue;

        realm.crashCount = 0;

        RAPI.getRealmIP(realm.id, () => {
            realm.crashCount++;

            console.log(realm.name, "Crashed", realm.crashCount)
        });
    }
})();