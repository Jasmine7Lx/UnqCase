const {
    splitAndGetSearchSpace,
    findAndInitSelfElementObj,
    swipeAction,
    getSpace,
    press,
    pressByCoordinate,
    assertMsgText,
    getInputString,
    assertMsgTime,
    sleepAction,
    getTime,
} = require('../commonMethod/baseActions');

/** =========================================================================== */
/** ============================== myplanet列表页面滑动 ================================= */
/** =========================================================================== */

async function swipeTimesAction(op, direction, times) {
    for (var i = 0; i < times; i++) {
        await swipeAction(op, direction);
      }
}

async function listSwipeAction(op, listType, direction, times) {
    let friendsList;
    let foryouList;
    let noticeList;
    switch (listType) {
        case 'friends':
            friendsList = await op.driver.element(
                "xpath",
                "//*[@resource-id='com.imo.android.imoimalpha:id/tabTitle'][@text='Friends']"
            );
            await friendsList.click();
            break;
        case 'foryou':
            foryouList = await op.driver.element(
                "xpath",
                "//*[@resource-id='com.imo.android.imoimalpha:id/tabTitle'][@text='For you']"
            );
            await foryouList.click();
            break;
        case 'topic':
            foryouList = await op.driver.element(
                "xpath",
                "//*[@resource-id='com.imo.android.imoimalpha:id/tabTitle'][@text='For you']"
            );
            await foryouList.click();
            await op.elementTap(
                '{"elementKey":"elementKeyNum_1255","platformName":"Android"}'
            );
            break;
        case 'notice':
            noticeList = await op.driver.element(
                "id",
                "com.imo.android.imoimalpha:id/iv_notice"
            );
            await noticeList.click();
            break;
    }
    swipeTimesAction(op, direction, times);
}




module.exports = {
    swipeTimesAction,
    listSwipeAction
}