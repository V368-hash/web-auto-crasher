const RealmAPI = require("./common/Realm");

const WhitelistedRealmIDs = [31569656];

(async () => {
    const RAPI = await RealmAPI();
    const realms = await RAPI.getRealms();
    await RAPI.joinRealm("YsBPyMNfhWQu96A");
    await RAPI.joinRealm("ibVXCPheNexf4HA");
   // await RAPI.joinRealm("4HzNgpA944N_vrU");
    await RAPI.joinRealm("MfVSeCUE-LmLhpE");
    await RAPI.joinRealm("igdXhLrxv6KfJjk");
    await RAPI.joinRealm("DPAdsZdhRG4jmKY");
    //await RAPI.joinRealm("ZzPBH7Beb7zYhg");
    await RAPI.joinRealm("VrgnDPoUiUrgxnM");
    //await RAPI.joinRealm("fn4vsCSQ4vhLcY");
    
    for (const i in realms) {
        const realm = realms[i];

        if (WhitelistedRealmIDs.includes(realm.id)) continue;
        if (realm.state === "CLOSED" || realm.expired) continue;

        console.log(`${Number(i) + 1}. ${realm.name} (${realm.id})`);

        await RAPI.getRealmIP(realm.id, (count) => {
            console.log(realm.name, "Crashed", count)
        });
    }
})();