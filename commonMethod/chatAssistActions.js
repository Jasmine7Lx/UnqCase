const {
    findAndInitSelfElementObj,
    swipeAction,
    getSpace,
    press,
    pressByCoordinate,
    assertMsgText,
    getTime,
    getInputString,
    assertMsgTime,
    sleepAction,
    splitAndGetSearchSpace,
} = require('../commonMethod/baseActions');

/**
 * 进入相对应的聊天界面
 * @param {*} op 设备
 * @param {*} name 聊天对象的姓名
 */
async function enterTargetChatView(op, name) {
    let searchSpace = await splitAndGetSearchSpace(await getSpace(op, 'window'), 0.7, 1, 0.8, 1);
    let searchBtn = await findAndInitSelfElementObj(op, 'unq|', 'scriptImg_1603080399491', searchSpace);
    if (searchBtn.element == null) {
        await op.back();
        searchBtn = await findAndInitSelfElementObj(op, 'unq|', 'scriptImg_1603080399491', searchSpace);
    }
    await press(op, searchBtn);
    let input = await op.driver.element('id', 'com.imo.android.imoimalpha:id/custom_search_view');
    await input.type(name);
    let result = await findAndInitSelfElementObj(op, 'appium|id', 'com.imo.android.imoimalpha:id/show');
    await result.element.click();
    await op.stepTag('已进入：' + name + ' 相关界面');
}

/** =============================================================== */
/** =========================== 发送消息 ============================= */
/** =============================================================== */

/**
 * 发送文本消息
 * @param {*} op 设备
 * @param {*} textType 文本类型，目前支持：EN（英文）/ CN（中文）/ number（数字）/ BN（孟加拉语）/ AR（阿拉伯语）/ IN（印地语）/ specialCode（特殊字符）
 * @param {*} textLength 文本长度
 * @returns 已发送的msgObj:
 *                      text：发送的文本
 *                      time：发送的时间
 */
async function sendTextMsgAction(op, textType, textLength) {
    /** 初始化msgObj */
    let msgObj = new Object();
    /** 操作 */
    let textStr = await getInputString(textType, textLength);
    await op.driver.element('id', 'com.imo.android.imoimalpha:id/chat_input').click();
    await op.driver.element('id', 'com.imo.android.imoimalpha:id/chat_input').type(textStr);
    await op.imgTap({ imgName: 'scriptImg_1593770843156' });
    /** 装备msgObj */
    msgObj.text = textStr;
    msgObj.time = await getTime();
    return msgObj;
}

/**
 * 发送语音消息
 * @param {*} op 操作的设备
 * @param {*} duration 语音消息时长
 * @param {*} needToAcceptPermission 是否需要允许权限
 * @returns 已发送的msgObj：
 *                      duration：语音消息的时长
 *                      time：发送的时间
 */
async function sendAudioMsgAction(op, duration, needToAcceptPermission) {
    /** 初始化msgObj */
    let msgObj = new Object();

    let searchSpace = await splitAndGetSearchSpace(await getSpace(op, 'window'), 0.7, 1, 0.8, 1);
    let audioBtn = await findAndInitSelfElementObj(op, 'unq|', 'scriptImg_1600676615756', searchSpace);
    /** 操作 */
    /** 如果需要允许权限，则轻按2秒，导出权限弹窗 */
    // if (!isNaN(needToAcceptPermission) && needToAcceptPermission == true) {
    //     await press(op, audioBtn, 2);
    //     await op.permissionAllow();
    // }

    /** 发送语音消息 */
    await press(op, audioBtn, duration);

    /** 装备msgObj */
    msgObj.duration = Math.floor(duration / 60) + ':' + Math.floor(duration / 10) + '' + Math.floor(duration % 10);
    msgObj.time = await getTime();
    return msgObj;
}

/**
 * 发送链接
 * @param {*} op 操作的设备
 * @param {*} linkStr 链接的文本
 * @param {*} imgName 链接解析完成后，图像识别的样式
 */
async function sendLinkMsgAction(op, linkStr, imgName) {
    /** 初始化msgObj */
    let msgObj = new Object();
    /** 操作 */
    await op.driver.element('id', 'com.imo.android.imoimalpha:id/chat_input').click();
    await op.driver.element('id', 'com.imo.android.imoimalpha:id/chat_input').type(linkStr);
    await op.imgTap({ imgName: 'scriptImg_1593770843156' });

    /** 装备msgObj */
    msgObj.imgName = imgName;
    msgObj.time = await getTime();
    return msgObj;
}

/**
 * 发送sticker
 * @param {*} op 操作的设备
 * @param {*} stickerTypeIndex sticker表情类型的index
 * @param {*} stickerIndex sticker表情的index
 * @param {*} imgName 发送的sticker的图像识别的标识
 */
async function sendStickerMsgAction(op, stickerTypeIndex, stickerIndex, imgName) {
    /** 初始化msgObj */
    let msgObj = new Object();
    /** 操作 */
    let operatorElement = await findAndInitSelfElementObj(op, 'appium|id', 'com.imo.android.imoimalpha:id/control_view');
    operatorElement.space.height = parseInt(op.windowSize.height) - parseInt(operatorElement.space.leftTopY);
    // let openningStickerFlag = await findAndInitSelfElementObj(op, 'unq|', 'scriptImg_1595255428474', operatorElement);
    let closingStickerFlag = await findAndInitSelfElementObj(op, 'appium|id', 'com.imo.android.imoimalpha:id/chat_sticker', operatorElement);
    let stickertype = await findAndInitSelfElementObj(op, 'appium|id', 'com.imo.android.imoimalpha:id/stickers_icn_wrapper', null, stickerTypeIndex);
    if (stickertype.element == null) {
        await press(op, closingStickerFlag);
    }
    stickertype = await findAndInitSelfElementObj(op, 'appium|id', 'com.imo.android.imoimalpha:id/stickers_icn_wrapper', null, stickerTypeIndex);
    await press(op, stickertype);
    let sticker = await findAndInitSelfElementObj(op, 'appium|id', 'com.imo.android.imoimalpha:id/sticker_image_view', null, stickerIndex);
    await press(op, sticker);
    await op.back();

    /** 装备msgObj */
    msgObj.imgName = imgName;
    msgObj.time = await getTime();
    return msgObj;
}

/**
 * 发生相册里面的图片/视频
 * @param {*} op 操作的设备
 * @param {*} photoIndex 图片/视频的位置：0表示图片，1表示视频
 * @param {*} imgName 所发送的图片/视频的图像识别标识
 */
async function sendAlbumMsgAction(op, resourceIndex, imgName) {
    let operatorElement, albumEntrance, photoElement, sendBtn;
    /** 初始化msgObj */
    let msgObj = new Object();
    /** 操作 */
    operatorElement = await findAndInitSelfElementObj(op, 'appium|id', 'com.imo.android.imoimalpha:id/control_view');
    operatorElement.space.height = parseInt(op.windowSize.height) - parseInt(operatorElement.space.leftTopY);
    albumEntrance = await findAndInitSelfElementObj(op, 'unq|', 'scriptImg_1602667640252', operatorElement);
    await press(op, albumEntrance);

    /** 进入相册文件夹 */
    await op.imgTap({ imgName: 'scriptImg_1598597898214' });

    /** 进入Camera这个文件夹 */
    await op.imgTap({ imgName: 'scriptImg_1598597914633' });

    await swipeAction(op, 'up');

    /** 选择资源 */
    if (resourceIndex instanceof Array) {
        for (let index = 0; index < resourceIndex.length; index++) {
            photoElement = await findAndInitSelfElementObj(op, 'appium|id', 'com.imo.android.imoimalpha:id/phone_gallery_check', null, resourceIndex[index]);
            await press(op, photoElement);
        }
    } else {
        photoElement = await findAndInitSelfElementObj(op, 'appium|id', 'com.imo.android.imoimalpha:id/phone_gallery_check', null, resourceIndex);
        await press(op, photoElement);
    }
    /** 发送 */
    await op.imgTap({ imgName: 'scriptImg_1598602107974' });

    /** 装备msgObj */
    msgObj.imgName = imgName;
    msgObj.time = await getTime();
    return msgObj;
}

/**
 * 发生现拍的图片/视频
 * @param {*} op 操作的设备
 * @param {*} msgType 现拍消息的类型：photo | video | loopVideo
 */
async function sendCameraMsgAction(op, msgType) {
    let targetObj, assistObj, searchSpace;
    /** 初始化msgObj */
    let msgObj = new Object();
    /** 操作 */
    assistObj = await findAndInitSelfElementObj(op, 'appium|id', 'com.imo.android.imoimalpha:id/control_view');
    assistObj.space.height = parseInt(op.windowSize.height) - parseInt(assistObj.space.leftTopY);
    targetObj = await findAndInitSelfElementObj(op, 'unq|', 'scriptImg_1603878357700', assistObj);
    await press(op, targetObj);

    /** 找到Camera按钮 */
    searchSpace = await splitAndGetSearchSpace(await getSpace(op, 'window'), 0, 1, 0.7, 1);
    targetObj = await findAndInitSelfElementObj(op, 'unq|', 'scriptImg_1600160750388', searchSpace);

    /** 根据msgType来判断发送类型 */
    switch (msgType) {
        case 'photo':
            {
                await press(op, targetObj);
            }
            break;
        case 'video':
            await press(op, targetObj, 10);
            break;
        case 'loopVideo':
            {
                assistObj = targetObj = await findAndInitSelfElementObj(op, 'unq|true', 'scriptImg_1603878744838', searchSpace);
                await press(op, assistObj);
                await press(op, targetObj, 5);
            }
            break;
    }
    /** 发送 */
    await op.imgTap({ imgName: 'scriptImg_1598602107974' });

    /** 装备msgObj */
    msgObj.time = await getTime();
    return msgObj;
}

/**
 * 发送文件类的消息
 * @param {*} op 被操作的设备
 * @param {*} fileType 待发送文件类型 : audio|file
 * @param {*} imgName 所发送文件在图像识别中的标识
 */
async function sendFileMsgAction(op, fileType, imgName) {
    let operatorElement, clipBtn, fileEntrance, assistElement, searchSpace;
    /** 初始化msgObj */
    let msgObj = new Object();
    /** 操作 */
    /** 进入文件界面 */
    operatorElement = await findAndInitSelfElementObj(op, 'appium|id', 'com.imo.android.imoimalpha:id/menu_panel');
    if (operatorElement.element == null) {
        /** 点击曲别针 */
        assistElement = await findAndInitSelfElementObj(op, 'appium|id', 'com.imo.android.imoimalpha:id/control_view');
        assistElement.space.height = parseInt(op.windowSize.height) - parseInt(assistElement.space.leftTopY);
        clipBtn = await findAndInitSelfElementObj(op, 'unq|', 'scriptImg_1598431132748', assistElement);
        await press(op, clipBtn);
        operatorElement = await findAndInitSelfElementObj(op, 'appium|id', 'com.imo.android.imoimalpha:id/menu_panel');
    }
    /** 进入文件界面 */
    fileEntrance = await findAndInitSelfElementObj(op, 'unq|', 'scriptImg_1598434609602', operatorElement);
    await press(op, fileEntrance);

    /** 选择文件类型进行发送 */
    switch (fileType) {
        case 'audio':
            {
                await op.imgTap({ imgName: 'scriptImg_1598603538127' });
                searchSpace = await splitAndGetSearchSpace(await getSpace(op, 'window'), 0, 1, 0, 0.3);
                operatorElement = await findAndInitSelfElementObj(op, 'unq|', 'scriptImg_1600865090274', searchSpace);
                await press(op, operatorElement);
            }
            break;
        case 'file':
            {
                await op.imgTap({ imgName: 'scriptImg_1598603705054' });
                searchSpace = await splitAndGetSearchSpace(await getSpace(op, 'window'), 0, 1, 0, 0.3);
                operatorElement = await findAndInitSelfElementObj(op, 'unq|true', 'scriptImg_1598586009529', searchSpace);
                await press(op, operatorElement);
            }
            break;
    }

    /** 发送 */
    searchSpace = await splitAndGetSearchSpace(await getSpace(op, 'window'), 0.5, 1, 0, 0.2);
    operatorElement = await findAndInitSelfElementObj(op, 'unq|', 'scriptImg_1598603579123', searchSpace);
    await press(op, operatorElement);

    /** 装备msgObj */
    msgObj.imgName = imgName;
    msgObj.time = await getTime();
    return msgObj;
}

/**
 * 回复消息
 * @param {*} op 设备
 * @param {*} textType 文本类型，目前支持：EN（英文）/ CN（中文）/ number（数字）/ BN（孟加拉语）/ AR（阿拉伯语）/ IN（印地语）/ specialCode（特殊字符）
 * @param {*} textLength 文本长度
 * @returns 已发送的msgObj:
 *                      text：发送的文本
 *                      time：发送的时间
 */
async function replyMsgAction(op, textType, textLength) {
    let replyBtn, opeartorView, replyContainer, msgObj;
    /** 操作 */

    /** 打开操作窗口 */
    opeartorView = await awakeOperationView(op);

    /** 点击回复 */
    replyBtn = await findAndInitSelfElementObj(op, 'unq|', 'scriptImg_1598440903933', opeartorView);
    await press(op, replyBtn);

    /** 检查回复消息的样式 */
    replyContainer = await findAndInitSelfElementObj(op, 'appium|id', 'com.imo.android.imoimalpha:id/reply_to_input_container');
    if (replyContainer.element == null) {
        await op.stepTag('没有出现回复消息的样式');
    }

    /** 回复消息 */
    msgObj = await sendTextMsgAction(op, textType, textLength);
    return msgObj;
}

/**
 * 分享消息
 * @param {*} op 被操作的设备
 * @param {*} target 分享的目标
 * @param {*} imgName 分享的内容，可以是分享的内容的图像识别标识，也可以是文本
 */
async function shareMsgAction(op, target, imgName) {
    /** 打开操作窗口 */
    await awakeOperationView(op);

    /** 点击分享 */
    await op.imgTap({ imgName: 'scriptImg_1598450933414' });

    /** 分享 */
    let msgObj = await shareAction(op, target, imgName);
    // await op.back();
    return msgObj;
}

/**
 * 删除操作
 * @param {*} op 被操作的设备
 */
async function deleteMsgAction(op) {
    /** 打开操作窗口 */
    await awakeOperationView(op);

    /** 点击删除 */
    await op.imgTap({ imgName: 'scriptImg_1597397967493' });

    /** 在弹起的确认删除弹窗，中点击确认 */
    // let hintObj = await findAndInitSelfElementObj(op, 'unq|', 'scriptImg_1598452878464');
    let hintObj = await splitAndGetSearchSpace(await getSpace(op, 'window'), 0.5, 1, 0.4, 0.7);
    let acceptObj = await findAndInitSelfElementObj(op, 'unq|', 'scriptImg_1594992170430', hintObj);
    await press(op, acceptObj);
}

/**
 * 下载操作
 * @param {*} op 被操作的设备；
 * @param {*} downLoadType 需要下载的文件类型：img|video|audio|file
 */
async function downloadMsgAction(op, downLoadType) {
    let startNum, endNum, downloadBtn, operatorView;
    let downloadTimes = 0;
    /** 上滑 */
    await swipeAction(op, 'up', await getSpace(op, 'window'));

    switch (downLoadType) {
        case 'img':
            {
                /** 获取起始资源数量 */
                startNum = await checkImageDowload(op);
                /** 唤醒操作窗口 */
                operatorView = await awakeOperationView(op);
                /** 点击下载 */
                downloadBtn = await findAndInitSelfElementObj(op, 'unq|', 'scriptImg_1598599499458', operatorView);
                await press(op, downloadBtn);
                /** 获取下载后的资源数量 */
                endNum = await checkImageDowload(op);
            }
            break;
        case 'video':
            {
                /** 获取起始资源数量 */
                startNum = await checkFileDownLoad(op, 'video');
                /** 唤醒操作窗口 */
                operatorView = await awakeOperationView(op);
                /** 点击下载 */
                downloadBtn = await findAndInitSelfElementObj(op, 'unq|', 'scriptImg_1598599499458', operatorView);
                await press(op, downloadBtn);
                /** 获取下载后的资源数量 */
                endNum = await checkFileDownLoad(op, 'video');
            }
            break;
        case 'audio':
            {
                /** 获取起始资源数量 */
                startNum = await checkFileDownLoad(op, 'audio');
                /** 操作下载 */
                downloadTimes = await fileDownLoadAction(op);
                /** 获取下载后的资源数量 */
                endNum = await checkFileDownLoad(op, 'audio');
            }
            break;
        case 'file': {
            /** 获取起始资源数量 */
            startNum = await checkFileDownLoad(op, 'file');
            /** 操作下载 */
            downloadTimes = await fileDownLoadAction(op);
            /** 获取下载后的资源数量 */
            endNum = await checkFileDownLoad(op, 'file');
        }
    }

    /** 检查 */
    if (parseInt(endNum) - parseInt(startNum) != 1 + downloadTimes) {
        await op.stepTag('下载失败，开始的时候，有 ' + startNum + ' 个资源，结束的时候有 ' + endNum + ' 个资源');
    }
}

/**
 * 文件下载功能
 * @param {*} op 被操作的设备
 */
async function fileDownLoadAction(op) {
    let downLoadTarget, downloadingOjb, downloadBtn, downloadedBtn;
    /** 获取聊天界面最后一个聊天tab */
    downLoadTarget = await findAndInitSelfElementObj(op, 'appium|id', 'com.imo.android.imoimalpha:id/ml_content_wrapper', null, -1);
    /** 点击进入文件详情页 */
    await pressByCoordinate(op, downLoadTarget.space.centerX + downLoadTarget.space.width / 4, downLoadTarget.space.centerY);
    /** 判断是否需要下载 */
    downloadBtn = await findAndInitSelfElementObj(op, 'unq|', 'scriptImg_1598453783204');
    downloadedBtn = await findAndInitSelfElementObj(op, 'unq|', 'scriptImg_1600867906105');
    if (downloadedBtn.element == null) {
        await press(op, downloadBtn);
        /**获取下载状态 */
        downloadingOjb = await findAndInitSelfElementObj(op, 'unq|', 'scriptImg_1598453674110');
        /** 等待下载完成 */
        while (downloadingOjb.element != null) {
            await sleepAction(5000);
            downloadingOjb = await findAndInitSelfElementObj(op, 'unq|', 'scriptImg_1598453674110');
        }
        /** 返回聊天界面 */
        await op.back();
        return 0;
    } else {
        /** 返回聊天界面 */
        await op.back();
        return -1;
    }
}

/**
 * 分享的操作
 * @param {*} op 被操作的设备
 * @param {*} target 分享目标的名字
 * @param {*} imgName 分享内容的图像识别标识
 */
async function shareAction(op, target, imgName) {
    /** 初始化msgObj */
    let msgObj = new Object();

    /** 获取分享界面，搜索输入框 */
    let searchEditor = await findAndInitSelfElementObj(op, 'appium|id', 'com.imo.android.imoimalpha:id/search_box');
    /** 输入被分享人的姓名 */
    await searchEditor.element.type(target);

    /** 勾选 */
    // await op.imgTap({ imgName: 'scriptImg_1598449840650' });
    let selectBtn = await findAndInitSelfElementObj(op, 'unq|', 'scriptImg_1598449840650');
    await press(op, selectBtn);
    /** 发送 */
    let sendBtn1 = await findAndInitSelfElementObj(op, 'unq|', 'scriptImg_1598449875757');
    if (sendBtn1.element == null) {
        sendBtn1 = await findAndInitSelfElementObj(op, 'unq|', 'scriptImg_1602814020383');
    }
    await press(op, sendBtn1);

    /** 装备msgObj */
    msgObj.target = target;
    msgObj.imgName = imgName;
    msgObj.time = await getTime();
    return msgObj;
}

/**
 * 分享视频卡片
 * @param {*} op 被操作的设备
 * @param {*} target 分享到哪里
 * @param {*} imgName 分享的卡片的图像识别样式
 */
async function shareVideoCardAction(op, target, imgName) {
    await op.back();
    await enterTargetChatView(op, 'AutoChannel');

    /** 查找对应的视频，并发送*/
    let targetVideoCard = await findAndInitSelfElementObj(
        op,
        'appium|xpath',
        "//android.widget.TextView[@text='Video']/following-sibling::android.widget.FrameLayout/android.widget.RelativeLayout/android.widget.ImageView"
    );

    /** 如果元素不存在，则上划 */
    while (targetVideoCard.element == null) {
        await swipeAction(op, 'up');
        targetVideoCard = await findAndInitSelfElementObj(
            op,
            'appium|xpath',
            "//android.widget.TextView[@text='Video']/following-sibling::android.widget.FrameLayout/android.widget.RelativeLayout/android.widget.ImageView"
        );
    }

    /** 点击分享 */
    await press(op, targetVideoCard);

    /** 分享 */
    let msgObj = await shareAction(op, target, imgName);

    /** 回到聊天界面 */
    await op.back();
    await op.back();

    /** 回到与被分享者的聊天界面 */
    await enterTargetChatView(op, target);

    return msgObj;
}

/**
 * 唤醒更多操作小弹窗
 * @param {*} op 被操作的设备
 */
async function awakeOperationView(op) {
    /** 上滑 */
    await swipeAction(op, 'up');
    /** 获取聊天界面最后一个聊天tab */
    let msgReply = await findAndInitSelfElementObj(op, 'appium|id', 'com.imo.android.imoimalpha:id/ml_content_wrapper', null, -1);

    /** 长按3秒，唤出操作弹窗 */
    //  await pressByCoordinate(op, msgReply.space.centerX + msgReply.space.width / 4, msgReply.space.centerY, 3);
    await press(op, msgReply, 3);
    /** 获取弹窗对象 */
    let operatorView = await findAndInitSelfElementObj(op, 'appium|id', 'com.imo.android.imoimalpha:id/lv');
    return operatorView;
}

/** =============================================================== */
/** =========================== 检查消息 ============================= */
/** =============================================================== */

/**
 * 检查文本消息
 * @param {*} hostOp 发送消息的设备
 * @param {*} guestOp 收取消息的设备
 * @param {*} msgObj 发送消息的msg
 */
async function checkTextMsgAction(hostOp, guestOp, msgObj) {
    let targetMsg, msgText, msgTime;
    /**  *********** 一、检查主设备  *********** */
    /** 上滑 */
    await swipeAction(hostOp, 'up');
    targetMsg = await findAndInitSelfElementObj(hostOp, 'appium|id', 'com.imo.android.imoimalpha:id/ml_content_wrapper', null, -1);

    /** 1、检查字符串是否相等 */
    msgText = await findAndInitSelfElementObj(hostOp, 'appiumParent|id', 'com.imo.android.imoimalpha:id/tv_message', targetMsg);
    if (msgText.element == null) {
        await hostOp.stepTag('主设备-没有找到消息文本');
    } else {
        await assertMsgText(hostOp, await msgText.element.text(), msgObj.text);
    }

    /** 2、检查时间是否相等 */
    msgTime = await findAndInitSelfElementObj(hostOp, 'appiumParent|xpath', "//android.widget.TextView[contains(@resource-id,'imkit_date')]", targetMsg);
    if (msgTime.element == null) {
        await hostOp.stepTag('副设备-没有找到消息发送时间');
    } else {
        await assertMsgTime(hostOp, await msgTime.element.text(), msgObj.time);
    }

    /** 3、检查是否存在msg status */
    await assertStutas(hostOp, targetMsg);

    /**  *********** 二、检查副设备  *********** */
    /** 上滑 */
    await swipeAction(guestOp, 'up');
    targetMsg = await findAndInitSelfElementObj(guestOp, 'appium|id', 'com.imo.android.imoimalpha:id/ml_content_wrapper', null, -1);

    /** 1、检查字符串是否相等 */
    msgText = await findAndInitSelfElementObj(guestOp, 'appiumParent|id', 'com.imo.android.imoimalpha:id/tv_message', targetMsg);
    if (msgText.element == null) {
        await guestOp.stepTag('副设备-没有找到消息文本');
    } else {
        await assertMsgText(guestOp, await msgText.element.text(), msgObj.text);
    }

    /** 2、检查时间是否相等 */
    msgTime = await findAndInitSelfElementObj(guestOp, 'appiumParent|xpath', "//android.widget.TextView[contains(@resource-id,'imkit_date')]", targetMsg);
    if (msgTime.element == null) {
        await guestOp.stepTag('副设备-没有找到消息发送时间');
    } else {
        await assertMsgTime(guestOp, await msgTime.element.text(), msgObj.time);
    }
}

/**
 * 检查语音消息
 * @param {*} hostOp 发送消息的设备
 * @param {*} guestOp 收取消息的设备
 * @param {*} msgObj 发送消息的msg
 */
async function checkAudioMsgAction(hostOp, guestOp, msgObj) {
    let targetMsg, msgDuration, msgTime;
    /**  *********** 一、检查主设备  *********** */
    /** 上滑 */
    await swipeAction(hostOp, 'up');
    targetMsg = await findAndInitSelfElementObj(hostOp, 'appium|id', 'com.imo.android.imoimalpha:id/ml_content_wrapper', null, -1);
    /** 1、检查时长 */
    msgDuration = await findAndInitSelfElementObj(hostOp, 'appiumParent|id', 'com.imo.android.imoimalpha:id/tv_duration', targetMsg);
    if (msgDuration.element == null) {
        await hostOp.stepTag('主设备-没有找到音频时间文本');
    } else {
        await assertMsgText(hostOp, await msgDuration.element.text(), msgObj.duration);
    }
    /** 2、检查发送时间 */
    msgTime = await findAndInitSelfElementObj(hostOp, 'appiumParent|xpath', "//android.widget.TextView[contains(@resource-id,'imkit_date')]", targetMsg);
    if (msgTime.element == null) {
        await hostOp.stepTag('主设备-找不到时间元素！');
    } else {
        await assertMsgTime(hostOp, await msgTime.element.text(), msgObj.time);
    }
    /** 3、检查状态 */
    await assertStutas(hostOp, targetMsg);

    /** *********** 二、检查副设备 *********** */
    /** 上滑 */
    await swipeAction(guestOp, 'up');
    targetMsg = await findAndInitSelfElementObj(guestOp, 'appium|id', 'com.imo.android.imoimalpha:id/ml_content_wrapper', null, -1);
    /** 1、检查时长 */
    msgDuration = await findAndInitSelfElementObj(guestOp, 'appiumParent|id', 'com.imo.android.imoimalpha:id/tv_duration', targetMsg);
    if (msgDuration.element == null) {
        await guestOp.stepTag('副设备-没有找到音频时间文本');
    } else {
        await assertMsgText(guestOp, await msgDuration.element.text(), msgObj.duration);
    }

    /** 2、检查发送时间 */
    msgTime = await findAndInitSelfElementObj(guestOp, 'appiumParent|xpath', "//android.widget.TextView[contains(@resource-id,'imkit_date')]", targetMsg);
    if (msgTime.element == null) {
        await guestOp.stepTag('副设备-找不到时间元素！');
    } else {
        await assertMsgTime(guestOp, await msgTime.element.text(), msgObj.time);
    }
}

/**
 * 检查link类消息
 * @param {*} hostOp 发送消息的设备
 * @param {*} guestOp 收取消息的设备
 * @param {*} msgObj 发送消息的msg
 */
async function checkImgMsgAction(hostOp, guestOp, msgObj) {
    let targetMsg, msgImg, msgTime;
    /**  *********** 一、检查主设备  *********** */
    /** 上滑 */
    await swipeAction(hostOp, 'up');
    targetMsg = await findAndInitSelfElementObj(hostOp, 'appium|id', 'com.imo.android.imoimalpha:id/ml_content_wrapper', null, -1);
    /** 1、检查发送的内容 */
    msgImg = await findAndInitSelfElementObj(hostOp, 'unq|', msgObj.imgName, targetMsg);
    if (msgImg.element == null) {
        await hostOp.stepTag('主设备-img 元素找不到 ');
    }
    /** 2、检查发送时间 */
    msgTime = await findAndInitSelfElementObj(hostOp, 'appiumParent|xpath', "//android.widget.TextView[contains(@resource-id,'imkit_date')]", targetMsg);
    if (msgTime.element == null) {
        await hostOp.stepTag('主设备-没有找到消息发送时间');
    } else {
        await assertMsgTime(hostOp, await msgTime.element.text(), msgObj.time);
    }
    /** 3、检查状态 */
    await assertStutas(hostOp, targetMsg);

    /** *********** 二、检查副设备 *********** */
    /** 上滑 */
    await swipeAction(guestOp, 'up');
    targetMsg = await findAndInitSelfElementObj(guestOp, 'appium|id', 'com.imo.android.imoimalpha:id/ml_content_wrapper', null, -1);
    /** 1、检查发送的内容 */
    msgImg = await findAndInitSelfElementObj(guestOp, 'unq|', msgObj.imgName, targetMsg);
    if (msgImg.element == null) {
        await guestOp.stepTag('副设备-img 元素找不到 ');
    }

    /** 2、检查发送时间 */
    msgTime = await findAndInitSelfElementObj(guestOp, 'appiumParent|xpath', "//android.widget.TextView[contains(@resource-id,'imkit_date')]", targetMsg);
    if (msgTime.element == null) {
        await guestOp.stepTag('副设备-没有找到消息发送时间');
    } else {
        await assertMsgTime(guestOp, await msgTime.element.text(), msgObj.time);
    }
}

/**
 * 检查回复类消息
 * @param {*} hostOp 回复消息的设备
 * @param {*} guestOp 收取消息的设备
 * @param {*} msgObj 回复消息的msg
 */
async function checkReplyMsgAction(hostOp, guestOp, msgObj) {
    let targetMsg, replyContainer;
    /**  *********** 一、检查主设备  *********** */
    /** 上滑 */
    await swipeAction(hostOp, 'up');
    targetMsg = await findAndInitSelfElementObj(hostOp, 'appium|id', 'com.imo.android.imoimalpha:id/ml_content_wrapper', null, -1);

    /** 1、检查已发送的消息中，最新一条是否有回复消息的样式 */
    replyContainer = await findAndInitSelfElementObj(hostOp, 'appiumParent|id', 'com.imo.android.imoimalpha:id/reply_to_container', targetMsg);
    if (replyContainer.element == null) {
        await hostOp.stepTag('主设备-已发送的消息中，没有出现回复消息的样式');
    }

    /**  *********** 一、检查副设备  *********** */
    /** 上滑 */
    await swipeAction(guestOp, 'up');
    targetMsg = await findAndInitSelfElementObj(guestOp, 'appium|id', 'com.imo.android.imoimalpha:id/ml_content_wrapper', null, -1);

    /** 1、检查已收取的消息中，最新一条是否有回复消息的样式 */
    replyContainer = await findAndInitSelfElementObj(guestOp, 'appiumParent|id', 'com.imo.android.imoimalpha:id/reply_to_container', targetMsg);
    if (replyContainer.element == null) {
        await guestOp.stepTag('副设备-已收取的消息中，没有出现回复消息的样式');
    }

    /** 2、检查两个设备的文本 */
    await checkTextMsgAction(hostOp, guestOp, msgObj);
}

/**
 * 检查分享类消息
 * @param {*} op 分享内容的设备
 * @param {*} msgObj 分享的内容
 * @param {*} backName 需要返回的界面
 */
async function checkShareAction(op, msgObj, backName) {
    let targetMsg, msgImg, msgText, msgTime;

    /** 回到首页 */
    await op.back();

    /**进入到被分享的人的聊天界面 */
    await enterTargetChatView(op, msgObj.target);
    if (msgObj.imgName.indexOf('scriptImg_') != -1) {
        /**  *********** 一、检查主设备  *********** */
        /** 上滑 */
        await swipeAction(op, 'up');
        targetMsg = await findAndInitSelfElementObj(op, 'appium|id', 'com.imo.android.imoimalpha:id/ml_content_wrapper', null, -1);
        /** 1、检查发送的内容 */
        msgImg = await findAndInitSelfElementObj(op, 'unq|', msgObj.imgName, targetMsg);
        if (msgImg.element == null) {
            await op.stepTag('主设备-分享的img 元素找不到 ');
        }
        /** 2、检查发送时间 */
        msgTime = await findAndInitSelfElementObj(op, 'appiumParent|xpath', "//android.widget.TextView[contains(@resource-id,'imkit_date')]", targetMsg);
        if (msgTime.element == null) {
            await op.stepTag('主设备-没有找到发送时间文本');
        } else {
            await assertMsgTime(op, await msgTime.element.text(), msgObj.time);
        }
        /** 3、检查状态 */
        await assertStutas(op, targetMsg);
    } else {
        /**  *********** 一、检查主设备  *********** */
        /** 上滑 */
        await swipeAction(op, 'up');
        targetMsg = await findAndInitSelfElementObj(op, 'appium|id', 'com.imo.android.imoimalpha:id/ml_content_wrapper', null, -1);

        /** 1、检查字符串是否相等 */
        msgText = await findAndInitSelfElementObj(op, 'appiumParent|id', 'com.imo.android.imoimalpha:id/tv_message', targetMsg);
        if (msgText.element == null) {
            await op.stepTag('主设备-没有找到消息文本');
        } else {
            await assertMsgText(op, await msgText.element.text(), msgObj.text);
        }

        /** 2、检查时间是否相等 */
        msgTime = await findAndInitSelfElementObj(op, 'appiumParent|xpath', "//android.widget.TextView[contains(@resource-id,'imkit_date')]", targetMsg);
        if (msgTime.element == null) {
            await op.stepTag('主设备-没有找到发送时间文本');
        } else {
            await assertMsgTime(op, await msgTime.element.text(), msgObj.time);
        }

        /** 3、检查是否存在msg status */
        await assertStutas(op, targetMsg);
    }
    /** 回去原来的界面 */
    await op.back();
    await enterTargetChatView(op, backName);
}

/**
 * 检查删除消息后的样式
 * @param {*} hostOp 主设备-执行删除操作的设备
 * @param {*} guestOp 副设备
 */
async function checkDeleteAction(hostOp, guestOp) {
    /** 在整个界面上查找-发送方-删除样式 */
    let hostTarget = await findAndInitSelfElementObj(hostOp, 'unq|', 'scriptImg_1598453275479');
    /** 在整个界面上查找-接收方- 删除样式 */
    let guestTarget = await findAndInitSelfElementObj(guestOp, 'unq|', 'scriptImg_1598453341427');

    /** 如果界面上存在删除信息，则返回false */
    if (hostTarget.element != null || guestTarget.element != null) {
        await hostOp.stepTag('界面上存在删除的信息');
        return false;
    }
    return true;
}

/**
 * 检查视频、音频、文档类的消息的下载
 * @param {*} op 被操作的设备
 * @param {*} fileType 文件类型 video|audio|file
 * @returns num 当前这类型的文件有多少个
 */
async function checkFileDownLoad(op, fileType) {
    let numObj, num, operatorElement, clipBtn, fileEntrance, assistElement, numStr;
    /** 根据曲别针的坐标，来判断是否打开了操作栏，没有则点曲别针 */
    assistElement = await findAndInitSelfElementObj(op, 'appium|id', 'com.imo.android.imoimalpha:id/control_view');
    assistElement.space.height = parseInt(op.windowSize.height) - parseInt(assistElement.space.leftTopY);
    clipBtn = await findAndInitSelfElementObj(op, 'unq|', 'scriptImg_1598431132748', assistElement);
    if (clipBtn.space.centerY > (op.windowSize.height * 4) / 5) {
        await press(op, clipBtn);
    }
    operatorElement = await findAndInitSelfElementObj(op, 'appium|id', 'com.imo.android.imoimalpha:id/menu_panel');
    /** 进入文件界面 */
    fileEntrance = await findAndInitSelfElementObj(op, 'unq|', 'scriptImg_1598434609602', operatorElement);
    await press(op, fileEntrance);

    switch (fileType) {
        case 'video':
            {
                /** 获取Video这一项有多少个文件 */
                numObj = await findAndInitSelfElementObj(op, 'appium|id', 'com.imo.android.imoimalpha.FileTransfer:id/num_files', null, 0);
            }
            break;
        case 'audio':
            {
                /** 获取Audio这一项有多少个文件 */
                numObj = await findAndInitSelfElementObj(op, 'appium|id', 'com.imo.android.imoimalpha.FileTransfer:id/num_files', null, 1);
            }
            break;
        case 'file':
            {
                /** 获取Document这一项有多少个文件 */
                numObj = await findAndInitSelfElementObj(op, 'appium|id', 'com.imo.android.imoimalpha.FileTransfer:id/num_files', null, 2);
            }
            break;
    }
    /** 装入msgObj */
    numStr = await numObj.element.text();
    num = parseInt(numStr.split(' ')[0]);

    /** 返回聊天界面 */
    await op.back();
    return num;
}

/**
 * 检查相片类消息的下载
 * @param {*} op 被操作的设备
 * @returns num 当前IMO文件夹下有多少个资源
 */
async function checkImageDowload(op) {
    let operatorElement, albumEntrance, numObj, num;

    /** 进入相册界面 */
    operatorElement = await findAndInitSelfElementObj(op, 'appium|id', 'com.imo.android.imoimalpha:id/control_view');
    operatorElement.space.height = parseInt(op.windowSize.height) - parseInt(operatorElement.space.leftTopY);
    albumEntrance = await findAndInitSelfElementObj(op, 'unq|', 'scriptImg_1602667640252', operatorElement);
    await press(op, albumEntrance);

    /** 进入相册文件夹 */
    await op.imgTap({ imgName: 'scriptImg_1598597898214' });

    /** 获取IMO文件夹的数量 */
    numObj = await findAndInitSelfElementObj(op, 'appium|xpath', "//android.widget.TextView[@text='imo']/following-sibling::android.widget.TextView");
    if (numObj.element == null) {
        num = 0;
    } else {
        num = await numObj.element.text();
    }
    await op.back();
    await op.back();
    return num;
}

/**
 * 检查状态
 * @param {*} op 操作设备
 * @param {*} targetMsg 父元素
 */
async function assertStutas(op, targetMsg) {
    let msgStatus = await findAndInitSelfElementObj(
        op,
        'appiumParent|xpath',
        "//android.widget.ImageView[contains(@resource-id,'iv_mes_state') or contains(@resource-id,'com.imo.android.imoimalpha:id/iv_file_status') or contains(@resource-id,'imkit_msg_state_') or contains(@resource-id,'com.imo.android.imoimalpha:id/iv_file_status')]",
        targetMsg
    );
    if (msgStatus.element == null) {
        await op.stepTag('该消息没有找到status');
    } else {
        await op.stepTag('主设备-检查消息状态成功！');
    }
}

/**
 * 准备聊天时要使用到的资源，目前会下载内容（图片、视频、文档、音频）到/sdcard/DCMI/Camera文件夹下
 * @param {*} hostOp 被操作的设备
 * @param {*} resourceName 所需资源名：image | video | audio | document
 */
async function chatResourcesPreparation(hostOp, resourceName) {
    /** 清理手机内容 */
    await hostOp.removeMedias();

    switch (resourceName) {
        case 'image':
            {
                /** 下载 - 图片资源*/
                await hostOp.addMediasWithUrls([
                    {
                        url: 'http://172.24.81.55/Imo/AutoResources/Img/autoTest-1.png',
                        count: 1,
                    },
                ]);
            }
            break;
        case 'video':
            {
                /** 下载 - 视频资源 */
                await hostOp.addMediasWithUrls([
                    {
                        url: 'http://172.24.81.55/Imo/AutoResources/video/autoTest-1.mp4',
                        count: 1,
                    },
                ]);
            }
            break;
        case 'audio':
            {
                /** 下载 - 音频资源 */
                await hostOp.addMediasWithUrls([
                    {
                        url: 'http://172.24.81.55/Imo/AutoResources/Audio/autoTest-1.mp3',
                        count: 1,
                    },
                ]);
            }
            break;
        case 'document':
            {
                /** 下载 - 文档资源 */
                await hostOp.addMediasWithUrls([
                    {
                        url: 'http://172.24.81.55/Imo/AutoResources/file/autoTest-1.pdf',
                        count: 1,
                    },
                ]);
            }
            break;
        default: {
            /** 下载 - 图片资源*/
            await hostOp.addMediasWithUrls([
                {
                    url: 'http://172.24.81.55/Imo/AutoResources/Img/autoTest-1.png',
                    count: 1,
                },
            ]);
            /** 下载 - 视频资源 */
            await hostOp.addMediasWithUrls([
                {
                    url: 'http://172.24.81.55/Imo/AutoResources/video/autoTest-1.mp4',
                    count: 1,
                },
            ]);
            /** 下载 - 音频资源 */
            await hostOp.addMediasWithUrls([
                {
                    url: 'http://172.24.81.55/Imo/AutoResources/Audio/autoTest-1.mp3',
                    count: 1,
                },
            ]);
            /** 下载 - 文档资源 */
            await hostOp.addMediasWithUrls([
                {
                    url: 'http://172.24.81.55/Imo/AutoResources/file/autoTest-1.pdf',
                    count: 1,
                },
            ]);
        }
    }
}

module.exports = {
    enterTargetChatView,
    sendTextMsgAction,
    sendAudioMsgAction,
    sendLinkMsgAction,
    sendStickerMsgAction,
    sendAlbumMsgAction,
    sendCameraMsgAction,
    sendFileMsgAction,
    replyMsgAction,
    shareMsgAction,
    deleteMsgAction,
    downloadMsgAction,
    shareAction,
    shareVideoCardAction,
    awakeOperationView,
    checkTextMsgAction,
    checkAudioMsgAction,
    checkImgMsgAction,
    checkReplyMsgAction,
    checkShareAction,
    checkDeleteAction,
    assertStutas,
    chatResourcesPreparation,
};
