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

/** 列表滑动 */
async function swipeTimesAction(op, direction, times) {
    for (var i = 0; i < times; i++) {
        await swipeAction(op, direction);
    }
}

/** =========================================================================== */
/** ========================== 进入myplanet不同页面 ============================= */
/** =========================================================================== */

async function listEnterAction(op, listType) {
    let friendsList;
    let foryouList;
    let noticeList;
    let myplanetEntrance = await findAndInitSelfElementObj(op, "appium|xpath", "//*[@resource-id='com.imo.android.imoimalpha:id/tv_tab_text'][@text='MyPlanet']");
    await myplanetEntrance.element.click();
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
    let topicListEntrance = await op.driver.element("id", "com.imo.android.imoimalpha:id/selected_topic_container");
    await topicListEntrance.click();
    await sleepAction(2000);
    let topicList = await findAndInitSelfElementObj(op, "appium|id", "com.imo.android.imoimalpha:id/name", null, 1);
    await topicList.element.click();
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
    let searchResult = await op.driver.elements("id", "com.imo.android.imoimalpha:id/tv_name");
    await searchResult[0].click();
}

/** 增加add人 */
async function publishAddPeople(op) {
    let addPeopleEntrance = await findAndInitSelfElementObj(op, "appium|id", "com.imo.android.imoimalpha:id/at_people_container");
    await addPeopleEntrance.element.click();
    let checkBox = await findAndInitSelfElementObj(op, "appium|id", "com.imo.android.imoimalpha:id/checkbox");
    await checkBox.element.click();
    let comfirmButton = await findAndInitSelfElementObj(op, "appium|id", "com.imo.android.imoimalpha:id/iv_scene");
    await comfirmButton.element.click();
}


/** 发布类型 */
async function publishPostAction(op, postType, ifAddTopic, ifAddLocation, ifAddPeople, locationName) {
    let cameraEntrance;
    let recordButton;
    let comfirmButton;
    let textEntrance;
    let textCards;
    let publishButton;
    if (await op.imgExist({ imgName: "scriptImg_1599114181526" })) {
        await op.back();
    }
    switch (postType) {
        case 'photo':
            cameraEntrance = await findAndInitSelfElementObj(op, "appium|id", "com.imo.android.imoimalpha:id/tv_camera");
            await cameraEntrance.element.click();
            recordButton = await findAndInitSelfElementObj(op, "appium|id", "com.imo.android.imoimalpha:id/video_progress");
            await recordButton.element.click();
            comfirmButton = await findAndInitSelfElementObj(op, "appium|id", "com.imo.android.imoimalpha:id/send");
            await comfirmButton.element.click();
            await op.keys("auto_photo");
            break;

        case 'video':
            cameraEntrance = await findAndInitSelfElementObj(op, "appium|id", "com.imo.android.imoimalpha:id/tv_camera");
            await cameraEntrance.element.click();
            recordButton = await findAndInitSelfElementObj(op, "appium|id", "com.imo.android.imoimalpha:id/video_progress");
            await press(op, recordButton, 10);
            comfirmButton = await findAndInitSelfElementObj(op, "appium|id", "com.imo.android.imoimalpha:id/send");
            await comfirmButton.element.click();
            await op.keys("auto_video");
            break;

        case 'text':
            textEntrance = await findAndInitSelfElementObj(op, "appium|id", "com.imo.android.imoimalpha:id/tv_text");
            await textEntrance.element.click();
            await op.keys("auto_text");
            break;

        case 'textcard':
            textEntrance = await findAndInitSelfElementObj(op, "appium|id", "com.imo.android.imoimalpha:id/tv_text");
            await textEntrance.element.click();
            textCards = await findAndInitSelfElementObj(op, "appium|id", "com.imo.android.imoimalpha:id/image_view", null, 2);
            await textCards.element.click();
            await op.keys("auto_text_card");
            break;
    }
    if (ifAddTopic) {
        await publishAddTopic(op);
    }
    if (ifAddLocation) {
        await publishAddLocation(op, locationName);
    }
    if (ifAddPeople) {
        await publishAddPeople(op);
    }
    publishButton = await findAndInitSelfElementObj(op, "appium|id", "com.imo.android.imoimalpha:id/iv_scene");
    await publishButton.element.click();
}


/** =========================================================================== */
/** ================================ 帖子发布检查 ================================== */
/** =========================================================================== */
async function postCheckAction(op, postImgName) {
    let sendingStatus = await findAndInitSelfElementObj(op, "appium|id", "com.imo.android.imoimalpha:id/thumbPlayIv");
    let sendFailStatus = await findAndInitSelfElementObj(op, "appium|id","om.imo.android.imoimalpha:id/waringMsg");
    /** 等待15s发不出去即失败 */
    if (sendingStatus != null || sendFailStatus != null) {
        await new Promise((resolve) => setTimeout(resolve, 15000));
    }
    /** 判断是否发送成功 */
    try {
        await op.imgAssert({ imgName: postImgName });
    } catch {
        await op.stepTag("帖子发布失败")
    }
}


/** =========================================================================== */
/** ================================ 帖子发布检查 ================================== */
/** =========================================================================== */
async function postDeleteAction(op, postImgName) {
    let moreButton = await findAndInitSelfElementObj(op, "appium|id", "com.imo.android.imoimalpha:id/ivMore");
    await moreButton.element.click();
    let deleteButton = await findAndInitSelfElementObj(op, "appium|id", "com.imo.android.imoimalpha:id/icon");
    await deleteButton.element.click();
    let comfirmButton = await findAndInitSelfElementObj(op, "appium|id", "com.imo.android.imoimalpha:id/btn_positive");
    await comfirmButton.element.click();
    try {
        await operation[0].imgNotExistAssert({ imgName: postImgName });
        await op.stepTag("帖子删除成功")
    } catch {
        await op.stepTag("帖子删除失败")
    }
}



module.exports = {
    swipeTimesAction,
    listEnterAction,
    networkCheckAction,
    followListSwipeAction,
    publishAddTopic,
    publishAddLocation,
    publishPostAction,
    publishAddPeople,
    postCheckAction,
    postDeleteAction
}