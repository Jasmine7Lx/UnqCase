const {
    findAndInitSelfElementObj,
    swipeAction,
    getSpace,
    press
} = require('../commonMethod/baseActions');

const {
    closeBigGroupPopWindow
  } = require("../commonMethod/bigGroupActions.js");

const {
    sendLinkMsgAction,
    enterTargetChatView
} = require('../commonMethod/chatAssistActions');

/** =========================================================================== */
/** ============================== 退出引导弹窗 ================================= */
/** =========================================================================== */

/**
 * 
 * @param {*} op 设备
 * @param {*} selectAct 弹窗选择，支持 'cancel'｜'follow'
 */
async function followPopAction(op, selectAct) {
    let followObj = await findAndInitSelfElementObj(op, 'appium|id', 'com.imo.android.imoimalpha:id/btn_confirm');
    let cancelObj = await findAndInitSelfElementObj(op, 'appium|id', 'com.imo.android.imoimalpha:id/btn_cancel');

    if (followObj.element != null) {
        switch (selectAct) {
            case 'follow':
                {
                    /** 点击关注 */
                    await press(op, followObj);
                }
                break;
            case 'cancel':
                {
                    /** 点击取消 */
                    await press(op, cancelObj);
                }
                break;
        }
    }
    else {
        await op.stepTag('无关注弹窗');
    }
}

/** =========================================================================== */
/** =============================== 取关订阅号 ================================== */
/** =========================================================================== */

async function unfollowAction(op) {
    await op.imgTap({ imgName: "scriptImg_1597398502063" });
    await op.imgTap({ imgName: "scriptImg_1597398539318" });
}

/** =========================================================================== */
/** ============================== 删除聊天记录 ================================= */
/** =========================================================================== */

async function deleteChatAction(op) {
    let chatMoreObj, doubleConfirm;
    chatMoreObj = await findAndInitSelfElementObj(op, 'appium|id', 'com.imo.android.imoimalpha:id/more_iv');
    await press(op, chatMoreObj);
    // await operation[0].imgTap({ imgName: "scriptImg_1597394945015" });
    await op.imgTap({ imgName: "scriptImg_1597397967493" });
    doubleConfirm = await findAndInitSelfElementObj(op, 'appium|id', 'com.imo.android.imoimalpha:id/btn_positive');
    await press(op, doubleConfirm);
    // await op.imgTap({ imgName: "scriptImg_1597398677059" });
}

/** =========================================================================== */
/** ========================== 通过deeplink进入订阅号 ============================ */
/** =========================================================================== */

/**
 * 
 * @param {*} op 设备
 * @param {*} linkStr 链接字符串
 */
async function enterChannelbyLink(op, linkStr) {
    await sendLinkMsgAction(op, linkStr, "scriptImg_1597395723143");
    await op.imgTap({ imgName: "scriptImg_1597395723143" });
}

/** =========================================================================== */
/** ================================ 切换城市 ================================== */
/** =========================================================================== */

/**
 * 
 * @param {*} op 设备
 * @param {*} cityName 城市名
 */
async function searchCityAction(op, cityName) {
    let searchResult;
    await op.removeBackgroundTap({ imgName: "scriptImg_1597400059257" });
    await op.keys(cityName);
    await op.imgTap({ imgName: "scriptImg_1597400417108" });
    searchResult = await op.driver.element("xpath", "//*[@resource-id='com.imo.android.imoimalpha:id/tv_name'][@text='Delhi, India']");
    await searchResult.click();
    // await op.removeBackgroundTap({ imgName: "scriptImg_1597400435871" });
    await op.imgTap({ imgName: "scriptImg_1597400447945" });
}

/** =========================================================================== */
/** ============================== 滑动查找元素 ================================= */
/** =========================================================================== */

/**
 * 
 * @param {*} op 设备
 * @param {*} targerImgName 要查找的元素imgName
 */
async function findSwiftElementAction(op, targerImgName) {
    let targetImg = await op.imgExist({ imgName: targerImgName});
    while (!targetImg) {
        await op.swipe(527 / 1080, 1580 / 1920, 578 / 1080, 551 / 1920);
        targetImg = await op.imgExist({ imgName: targerImgName});
    }
}

/** =========================================================================== */
/** =========================== 分享到多个会话 ================================== */
/** =========================================================================== */

/**
 * 
 * @param {*} op 设备
 * @param {*} targets 会话昵称，数组
 */
async function shareMoreAction(op, targets) {
    for (let i = 0; i < targets.length; i++) {
        /** 获取分享界面，搜索输入框 */
        let searchEditor = await findAndInitSelfElementObj(op, 'appium|id', 'com.imo.android.imoimalpha:id/search_box');
        /** 输入被分享人的姓名 */
        await searchEditor.element.type(targets[i]);
        /** 勾选 */
        await op.imgTap({ imgName: 'scriptImg_1598449840650' });
    }
    /** 发送 */
    await op.imgTap({ imgName: 'scriptImg_1598449875757' });
}

/** =========================================================================== */
/** =========================== 分享到不同类型story ============================== */
/** =========================================================================== */

/**
 * 
 * @param {*} op 设备
 * @param {*} storyType story类型，可选：'mystory'|'fof'|'groupstory'|'myplanet'
 */
async function shareStoryAction(op, storyType) {
    let storyEntrance;
    if (storyType == 'groupstory') {
        storyEntrance = await op.driver.element(
            "xpath",
            "//*[@resource-id='com.imo.android.imoimalpha:id/toptext'][@text='Group Story']"
        );
        await storyEntrance.click();
        let box;
        let bool = false;
        // let groupStory = new Array();
        for (index = 0; index < 3; index++) {
            if (bool) {
                break;
            } else {
                let groupStory = await op.driver.elements(
                    "id",
                    "com.imo.android.imoimalpha:id/name"
                );
                for (i = 0; i < groupStory.length; i++) {
                    if (await groupStory[i].text() == 'Invincible_Imo_Auto_Group') {
                        await groupStory[i].click();
                        await op.imgTap({ imgName: "scriptImg_1598603579123" });
                        bool = true;
                        return;
                    }
                }
                box = await op.driver.element("id", "android:id/parentPanel");
                await swipeAction(op, "up", await getSpace(op, "appium", box));
            }
        }
    }

    else {
        switch (storyType) {
            case 'mystory':
                storyEntrance = await op.driver.element(
                    "xpath",
                    "//*[@resource-id='com.imo.android.imoimalpha:id/toptext'][@text='My Story']"
                );
                break;
            case 'fof':
                storyEntrance = await op.driver.element(
                    "xpath",
                    "//*[@resource-id='com.imo.android.imoimalpha:id/toptext'][@text='Friends of friends']"
                );
                break;
            case 'myplanet':
                storyEntrance = await op.driver.element(
                    "xpath",
                    "//*[@resource-id='com.imo.android.imoimalpha:id/toptext'][@text='MyPlanet']"
                );
                break;
        }
        await storyEntrance.click();
    }
    await op.imgTap({ imgName: "scriptImg_1598603579123" });
}

/** =========================================================================== */
/** =========================== story检查图片是否存在 ============================ */
/** =========================================================================== */

/**
 * 
 * @param {*} op 设备
 * @param {*} targerImgName 要检查的元素imgName
 */
async function storyCheckAction(op, targerImgName) {
    let mystoryEntrance = await op.driver.element(
        "xpath",
        "//*[@resource-id='com.imo.android.imoimalpha:id/name'][@text='My Story']"
      );
    await mystoryEntrance.click();
    try {
        await op.removeBackgroundAssert({ imgName: targerImgName });
    } catch (err) {
    await op.stepTag("分享到story失败");
    }
    await op.imgTap({ imgName: "scriptImg_1599657167481" });
    await op.imgTap({ imgName: "scriptImg_1599657179326" });
    await op.back();
}

/** =========================================================================== */
/** =========================== 会话检查图片是否存在 ============================ */
/** =========================================================================== */

async function chatCheckAction(op, chatName, targerImgName) {
    await enterTargetChatView(op, chatName);
    await closeBigGroupPopWindow(operation[0]);
    //处理命中表情引导
    let chatInput = await op.driver.element(
        "id",
        "com.imo.android.imoimalpha:id/chat_input"
        );
    await chatInput.click();
  
    try {
      await op.imgAssert({ imgName: targerImgName });
    } catch (err) {
      await op.stepTag("分享到会话失败");
    }
}


module.exports = {
    followPopAction,
    unfollowAction,
    deleteChatAction,
    enterChannelbyLink,
    searchCityAction,
    shareMoreAction,
    shareStoryAction,
    findSwiftElementAction,
    storyCheckAction,
    chatCheckAction
};