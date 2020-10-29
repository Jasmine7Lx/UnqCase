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
                await swipeTimesAction(op, "up", 15);
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
                await swipeTimesAction(op, "up", 15);
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
                await swipeTimesAction(op, "up", 15);
            } else {
                await op.stepTag("推荐列表数据不存在");
            }
            break;
    }
}




/** =========================================================================== */
/** ================================ 发布帖子 ================================== */
/** =========================================================================== */
/** 添加话题-固定选话题列表第一个话题 */
async function publishAddTopic(op) {
    let topicListEntrance = await findAndInitSelfElementObj(op, "appium|id", "com.imo.android.imoimalpha:id/selected_topic_container");
    await topicListEntrance.click();
    let topicList = await op.driver.elements("id", "com.imo.android.imoimalpha:id/list_view");
    await topicList[1].click();
}

/** 添加定位 */
async function publishAddLocation(op, locationName) {
    let locationEntrance = await op.driver.element("id", "com.imo.android.imoimalpha:id/location_container");
    await locationEntrance.click();
    //授权定位
    if (
        await op.removeBackgroundExist({
            imgName: "scriptImg_1597399803799",
        })
    ) {
        await op.permissionAllow();
    }
    let searchBar = await op.driver.element("id", "com.imo.android.imoimalpha:id/tv_search_entry");
    await searchBar.click();
    let searchBar2 = await op.driver.element("id", "com.imo.android.imoimalpha:id/et_search_place");
    await searchBar2.click();
    await op.keys(locationName);
    let searchButton = await op.driver.element("id", "com.imo.android.imoimalpha:id/btn_search");
    await searchButton.click();
    let searchResult = await op.driver.elements("id", "com.imo.android.imoimalpha:id/recycler_view");
    // await op.stepTag(searchResult[0]);
    await searchResult[0].click();
}


async function publishPostAction(op, postType) {
    if (await op.imgExist({ imgName: "scriptImg_1599114181526" })) {
        await op.back();
    }
    switch (postType) {
        case 'photo':
            await op.imgTap({ imgName: "scriptImg_1598405796627" });
            if (
                await op.removeBackgroundExist({
                    imgName: "scriptImg_1597399803799",
                })
            ) {
                await op.permissionAllow();
            }
            await op.imgTap({ imgName: "scriptImg_1598408622457" });
            await op.imgTap({ imgName: "scriptImg_1597395689900" });
            await op.keys("auto_photo");
            break;

        default:
            break;
    }

}


/** =========================================================================== */
/** ================================ 帖子发布检查 ================================== */
/** =========================================================================== */



module.exports = {
    swipeTimesAction,
    listSwipeAction,
    networkCheckAction,
    followListSwipeAction,
    publishAddTopic,
    publishAddLocation
}