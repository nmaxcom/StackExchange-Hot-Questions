/* ============================================ */
/* StackExchange Hot Questions e-mail digest	*/
/* written by Carles Alcolea (nmaxcom)			*/
/* v 1.2						Sept 2014		*/
/*                                              */
/* ============================================ */
/* Readme: Just configure these 3 items down
/* below and run the CreateRecurringTrigger()
/* function. It's all done!
/* The script will immediately send you one
/* e-mail to sort of test that everything is
/* fine. From then on you should be getting your
/* digest.



/* ONLY THREE THINGS TO CONFIGURE */
// Whenever you modify this stuff, run the RUN_ME() function and it'll update the trigger
var emailDestination = Session.getActiveUser().getEmail(); // e-mail from your actual google session (you can manually change it to send it to another e-mail, surrounded by quotes)
var daysFrequency    = 2;                                  // every 2 days
var maxQuestions     = 15;                                 // 15 first (highest rank) hottest network questions of the very same day we send the e-mail
/* ============================================ */




/* ============================================ */
/* ============================================ */
/* ============================================ */
/* ============================================ */
/*       Now the no-need-to-touch code          */
/* ============================================ */
/* ============================================ */
/* ============================================ */
var SEfeed = "https://stackexchange.com/feeds"; // from the hot goodies
var body = '<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN" "http://www.w3.org/TR/REC-html40/loose.dtd"><html><head></head><body>';

function RUN_ME() {
    // We'll first clear all existin triggers to make sure we always have only one
    ClearTriggers();
    // Now create
    ScriptApp.newTrigger('go')
        .timeBased()
        .everyDays(daysFrequency)
        .create();
    // And send our first issue!
    go();
}

function ClearTriggers() {
    // Loop over all triggers.
    var allTriggers = ScriptApp.getProjectTriggers();
    for (var i = 0; i < allTriggers.length; i++) {
        ScriptApp.deleteTrigger(allTriggers[i]);
    }
}

function go() {
    generateMail();
    sendIt();
}

function generateMail() {
    var xml = UrlFetchApp.fetch(SEfeed).getContentText();
    var root = XmlService.parse(xml).getRootElement();
    var atom = XmlService.getNamespace('http://www.w3.org/2005/Atom');
    var entries = root.getChildren('entry', atom);

    var totalQuestions = Math.min(entries.length, maxQuestions);

    for (var i = 0; i < totalQuestions; i++) {
        var title = entries[i].getChild('title', atom).getText();
        var categoryElements = entries[i].getChildren('category', atom);

        var updated = entries[i].getChild('updated', atom).getValue();
        var url = entries[i].getChild('id', atom).getValue();
        var summary = entries[i].getChild('summary', atom).getText();
        var user = entries[i].getChildren('author', atom)[0].getChild('name', atom).getValue();
        var userURL = entries[i].getChildren('author', atom)[0].getChild('uri', atom).getValue();

        var regexSubSite = /https:\/\/(.*?).stackexchange\.com/.exec(url);
        var imgsite, site, siteURL;
        if (!regexSubSite) // If it's not a "subsite"...
        {
            site = /https:\/\/(.*)\.com/.exec(url);
            site = site ? site[1] : "noneFound";

            siteURL = site ? "https://www." + site + ".com" : "noneFound";

        } else {
            site = regexSubSite[1];
            siteURL = regexSubSite[0];
        }
        if (site == "meta")
        {
            imgsite = "stackexchangemeta";
        } else {
            imgsite = site;
        }

        body += '<div style="color: rgb(68, 68, 68); width: 725px; perspective-origin: 362.5px 1199.5px; transform-origin: 362.5px 1199.5px; font-style: normal; border: 0px none rgb(68,68,68); font-variant: normal; font-weight: normal; font-family: Helvetica Neue, Helvetica, Arial, sans-serif; line-height: 19.6000003814697px; font-size: 14px; outline: rgb(68, 68, 68) none 0px; margin-top: 5px;">' +
            '<div  style="box-shadow: rgb(255, 255, 255) 0px 1px 0px 0px; clear: both; color: rgb(68, 68, 68); height: 47px; width: 693px; perspective-origin: 361.5px 31.5px; transform-origin: 361.5px 31.5px; font-style: normal; border-width: 0px 0px 1px; border-style: none none solid; font-variant: normal; font-weight: normal; font-size: 14px; border-color: rgb(68, 68, 68) rgb(68, 68, 68) rgb(240, 240, 240); font-family: Helvetica Neue, Helvetica, Arial, sans-serif; padding: 0px 15px 15px; line-height: 19.6000003814697px; outline: rgb(68, 68, 68) none 0px; overflow: auto;">' +
            '<a href="' + url + '"  style="color: rgb(54, 111, 179); cursor: pointer; text-decoration: none; font-variant: normal; font-style: normal; border: 0px none rgb(54,111,179); font-weight: normal; font-family: Helvetica Neue, Helvetica, Arial, sans-serif; line-height: 19.6000003814697px; font-size: 14px; outline: rgb(54, 111, 179) none 0px;"></a>' +
            '<div  style="color: rgb(54, 111, 179); cursor: pointer; float: left; height: 37px; width: 32px; perspective-origin: 16px 18.5px; transform-origin: 16px 18.5px; font-style: normal; border: 0px none rgb(54,111,179); font-variant: normal; font-weight: normal; font-size: 14px; margin: 3px 15px 0px 0px; font-family: Helvetica Neue, Helvetica, Arial, sans-serif; line-height: 19.6000003814697px; outline: rgb(54, 111, 179) none 0px;">' +
            '<span  style="color: rgb(54, 111, 179); cursor: pointer; font-weight: normal; font-style: normal; font-variant: normal; border: 0px none rgb(54,111,179); font-family: Helvetica Neue, Helvetica, Arial, sans-serif; line-height: 19.6000003814697px; font-size: 14px; outline: rgb(54, 111, 179) none 0px;"><img src="https://cdn.sstatic.net/Sites/' + imgsite + '/img/icon-48.png" alt="' + site + '"  style="color: rgb(54, 111, 179); cursor: pointer; height: 32px; width: 32px; perspective-origin: 16px 16px; transform-origin: 16px 16px; font-style: normal; border: 0px none rgb(54,111,179); font-variant: normal; font-weight: normal; font-family: Helvetica Neue, Helvetica, Arial, sans-serif; line-height: 19.6000003814697px; font-size: 14px; outline: rgb(54, 111, 179) none 0px;"></span>' +
            '</div>' +
            '<div  style="color: rgb(68, 68, 68); float: left; height: 47px; width: 628px; perspective-origin: 314px 23.5px; transform-origin: 314px 23.5px; font-style: normal; border: 0px none rgb(68,68,68); font-variant: normal; font-weight: normal; font-family: Helvetica Neue, Helvetica, Arial, sans-serif; line-height: 19.6000003814697px; font-size: 14px; outline: rgb(68, 68, 68) none 0px;">' +
            '<h2  style="color: rgb(68, 68, 68); height: 22px; width: 628px; perspective-origin: 314px 11px; transform-origin: 314px 11px; font-variant: normal; font-style: normal; border: 0px none rgb(68,68,68); font-weight: normal; font-size: 18px; margin: 0px 0px 4px; font-family: Helvetica Neue, Helvetica, Arial, sans-serif; line-height: 22px; outline: rgb(68, 68, 68) none 0px;">' +
            '<a href="' + url + '" style="color: rgb(54, 111, 179); cursor: pointer; text-decoration: none; font-variant: normal; font-style: normal; border: 0px none rgb(54,111,179); font-weight: normal; font-family: Helvetica Neue, Helvetica, Arial, sans-serif; line-height: 22px; font-size: 18px; outline: rgb(54, 111, 179) none 0px;">' + title + '</a>' +
            '</h2>' +
            '<span style="color: rgb(153, 153, 153); font-weight: normal; font-style: normal; font-variant: normal; border: 0px none rgb(153,153,153); font-family: Helvetica Neue, Helvetica, Arial, sans-serif; line-height: 15.3999996185303px; font-size: 11px; outline: rgb(153, 153, 153) none 0px;">by <a href="' + userURL + '"  style="color: rgb(54, 111, 179); cursor: pointer; text-decoration: none; font-variant: normal; font-style: normal; border: 0px none rgb(54,111,179); font-weight: normal; font-family: Helvetica Neue, Helvetica, Arial, sans-serif; line-height: 15.3999996185303px; font-size: 11px; outline: rgb(54, 111, 179) none 0px;">' + user + '</a> on</span>  <a href="' + siteURL + '"\style="color: rgb(54, 111, 179); cursor: pointer; text-decoration: none; font-variant: normal; font-style: normal; border: 0px none rgb(54,111,179); font-weight: normal; font-family: Helvetica Neue, Helvetica, Arial, sans-serif; line-height: 15.3999996185303px; font-size: 11px; outline: rgb(54, 111, 179) none 0px;">' + site + '</a>' +
            '</div>' +
            '</div>' +
            '</div>';
    }

    body += "</body></html>";
}

function sendIt() {
    MailApp.sendEmail({
        to: emailDestination,
        subject: "Your " + maxQuestions + " hottest questions from StackExchange!",
        htmlBody: body
    });
}
