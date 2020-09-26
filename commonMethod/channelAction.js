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

const {
    sendLinkMsgAction,
} = require('../commonMethod/chatAssistActions');

/**
 * 首次退出关注引导
 * @param {*} op
 * @param {*} selectAction
 */
async function followPopAction(op, selectAct) {
    let followObj = await findAndInitSelfElementObj(op, 'appium|id', 'com.imo.android.imoimalpha:id/btn_confirm');
    let cancelObj = await findAndInitSelfElementObj(op, 'appium|id', 'com.imo.android.imoimalpha:id/btn_cancel');

    if(followObj.element != null) {
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

async function unfollowAction(op) {
    await op.imgTap({ imgName: "scriptImg_1597398502063" });
    await op.imgTap({ imgName: "scriptImg_1597398539318" });
}

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

async function enterChannelbyLink(op, linkStr) {
    let channelLinkImg = "scriptImg_1597395723143";
    sendLinkMsgAction(op, linkStr, channelLinkImg);
    await op.imgTap({ imgName: "scriptImg_1597395723143" });
}

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

module.exports = {
    followPopAction,
    unfollowAction,
    deleteChatAction,
    enterChannelbyLink,
    searchCityAction,
};