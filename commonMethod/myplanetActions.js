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
        case 'friends': {
            let myplanetMenuTab = await findAndInitSelfElementObj(op, 'appium|id', 'com.imo.android.imoimalpha:id/smartTabLayout');
            await swipeAction(op, "right", myplanetMenuTab)
            friendsList = await op.driver.element(
                "xpath",
                "//*[@resource-id='com.imo.android.imoimalpha:id/tabTitle'][@text='Friends']"
            );
            await friendsList.click();
            break;
        }
        case 'foryou': {
            foryouList = await op.driver.element(
                "xpath",
                "//*[@resource-id='com.imo.android.imoimalpha:id/tabTitle'][@text='For you']"
            );
            await foryouList.click();
            break;
        }
        case 'topic': {
            foryouList = await op.driver.element(
                "xpath",
                "//*[@resource-id='com.imo.android.imoimalpha:id/tabTitle'][@text='For you']"
            );
            await foryouList.click();
            await op.elementTap(
                '{"elementKey":"elementKeyNum_1255","platformName":"Android"}'
            );
            break;
        }
        case 'notice': {
            noticeList = await op.driver.element(
                "id",
                "com.imo.android.imoimalpha:id/iv_notice"
            );
            await noticeList.click();
            break;
        }
    }
    await networkCheckAction(op);
    await swipeTimesAction(op, direction, times);
}

/** =========================================================================== */
/** ============================== 判断网络是否异常 ============================== */
/** =========================================================================== */
async function networkCheckAction(op) {
    let refreshElement = await op.elementExist(
        '{"elementKey":"elementKeyNum_1254","platformName":"Android"}'
    );
    while (refreshElement) {
        let refreshButton = await op.driver.element(
            "id",
            "com.imo.android.imoimalpha:id/topic_empty_refresh"
        );
        await refreshButton.click();
        refreshElement = await op.elementExist(
            '{"elementKey":"elementKeyNum_1254","platformName":"Android"}'
        );
    }
}


/** =========================================================================== */
/** ============================== 关注列表滑动 ============================== */
/** =========================================================================== */
async function followListSwipeAction(op, listType) {
    let followButton = await findAndInitSelfElementObj(op, "appium|id", "com.imo.android.imoimalpha:id/btn_follow");
    let unfollowButton = await findAndInitSelfElementObj(op, "appium|id", "com.imo.android.imoimalpha:id/ic_followed");
    
    switch (listType) {
        case 'following':
            let followingTab = await op.driver.element(
                "xpath",
                "//*[@resource-id='com.imo.android.imoimalpha:id/tv_tab_text'][@text='Following']"
            );
            await followingTab.click();
            if (unfollowButton != null) {
                await swipeTimesAction(op, "up", 20);
            } else {
                await op.stepTag("关注列表数据不存在");
            }
            break;
        case 'followers':
            let followersTab = await op.driver.element(
                "xpath",
                "//*[@resource-id='com.imo.android.imoimalpha:id/tv_tab_text'][@text='Followers']"
              );
            await followersTab.click();
            if (followButton != null) {
                await swipeTimesAction(op, "up", 20);
            } else {
                await op.stepTag("粉丝列表数据不存在");
            }
            break;
        case 'recommend':
            let recommendTab = await op.driver.element(
                "xpath",
                "//*[@resource-id='com.imo.android.imoimalpha:id/tv_tab_text'][@text='Recommend']"
              );
            await recommendTab.click();
            if (followButton != null) {
                await swipeTimesAction(op, "up", 20);
            } else {
                await op.stepTag("推荐列表数据不存在");
            }
            break;
    }
}





module.exports = {
    swipeTimesAction,
    listSwipeAction,
    networkCheckAction,
    followListSwipeAction
}