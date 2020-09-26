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

const { shareAction } = require('../commonMethod/chatAssistActions');

/**
 * 关闭刚进大群时，那个弹窗
 * @param {*} op
 */
async function closeBigGroupPopWindow(op) {
    await sleepAction(5000);
    let closeBtn = await findAndInitSelfElementObj(op, 'appium|id', 'com.imo.android.imoimalpha:id/close_rank_iv');
    if (closeBtn.element != null) {
        await closeBtn.element.click();
    }
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
 */
async function sendBGTextMsgAction(op, textType, textLength) {
    /** 初始化msgObj */
    let msgObj = new Object();
    /** 操作 */
    let textStr = await getInputString(textType, textLength);
    await op.driver.element('id', 'com.imo.android.imoimalpha:id/chat_input').click();
    await op.driver.element('id', 'com.imo.android.imoimalpha:id/chat_input').type(textStr);
    await op.imgTap({ imgName: 'scriptImg_1593770843156' });
    /** 装备msgObj */
    msgObj.text = textStr;
    return msgObj;
}

/**
 * 发送语音消息
 * @param {*} op 操作的设备
 * @param {*} duration 语音消息时长
 * @param {*} needToAcceptPermission 是否需要允许权限
 * @returns 已发送的msgObj：
 *                      duration：语音消息的时长
 */
async function sendBGAudioMsgAction(op, duration, needToAcceptPermission) {
    /** 初始化msgObj */
    let msgObj = new Object();

    let audioBtn = await findAndInitSelfElementObj(op, 'unq|', 'scriptImg_1595297983863');
    /** 操作 */
    /** 如果需要允许权限，则轻按2秒，导出权限弹窗 */
    if (!isNaN(needToAcceptPermission)) {
        await press(op, audioBtn, 2);
        await op.permissionAllow();
    }

    /** 发送语音消息 */
    await press(op, audioBtn, duration);

    /** 装备msgObj */
    msgObj.duration = Math.floor(duration / 60) + ':' + Math.floor(duration / 10) + '' + Math.floor(duration % 10);
    return msgObj;
}

/**
 * 发送链接
 * @param {*} op 操作的设备
 * @param {*} linkStr 链接的文本
 * @param {*} imgName 链接解析完成后，图像识别的样式
 * @returns 已发送的msgObj：
 *                      imgName：链接解析完成后，图像识别的样式
 */
async function sendBGLinkMsgAction(op, linkStr, imgName) {
    /** 初始化msgObj */
    let msgObj = new Object();
    /** 操作 */
    await op.driver.element('id', 'com.imo.android.imoimalpha:id/chat_input').click();
    await op.driver.element('id', 'com.imo.android.imoimalpha:id/chat_input').type(linkStr);
    await op.imgTap({ imgName: 'scriptImg_1593770843156' });

    /** 装备msgObj */
    msgObj.imgName = imgName;
    return msgObj;
}

/**
 * 发送sticker
 * @param {*} op 操作的设备
 * @param {*} stickerTypeIndex sticker表情类型的index
 * @param {*} stickerIndex sticker表情的index
 * @param {*} imgName 发送的sticker的图像识别的标识
 * @returns 已发送的msgObj：
 *                      imgName：链接解析完成后，图像识别的样式
 */
async function sendBGStickerMsgAction(op, stickerTypeIndex, stickerIndex, imgName) {
    /** 初始化msgObj */
    let msgObj = new Object();
    /** 操作 */
    let operatorElement = await findAndInitSelfElementObj(op, 'appium|id', 'com.imo.android.imoimalpha:id/rv_record');
    let openningStickerFlag = await findAndInitSelfElementObj(op, 'unq|', 'scriptImg_1595255428474', operatorElement);
    let clisingStickerFlag = await findAndInitSelfElementObj(op, 'unq|', 'scriptImg_1595234320193', operatorElement);
    if (openningStickerFlag.element == null) {
        await press(op, clisingStickerFlag);
    }
    /** 选择Sticker表情的类型 */
    let stickertype = await findAndInitSelfElementObj(op, 'appium|id', 'com.imo.android.imoimalpha:id/stickers_icn_wrapper', null, stickerTypeIndex);
    await press(op, stickertype);
    /** 选择Sticker表情 */
    let sticker = await findAndInitSelfElementObj(op, 'appium|id', 'com.imo.android.imoimalpha:id/sticker_image_view', null, stickerIndex);
    await press(op, sticker);
    await op.back();

    /** 装备msgObj */
    msgObj.imgName = imgName;
    return msgObj;
}

/**
 * 发生相册里面的图片/视频
 * @param {*} op 操作的设备
 * @param {*} photoIndex 图片/视频的位置：0表示图片，1表示视频
 * @param {*} imgName 所发送的图片/视频的图像识别标识
 * @returns 已发送的msgObj：
 *                      imgName：链接解析完成后，图像识别的样式
 */
async function sendBGAlbumMsgAction(op, resourceIndex, imgName) {
    let photoElement;
    /** 初始化msgObj */
    let msgObj = new Object();
    /** 操作 */
    await enterClipView(op, 'gallery');

    /** 进入相册文件夹 */
    await op.imgTap({ imgName: 'scriptImg_1598597898214' });

    /** 进入Camera这个文件夹 */
    await op.imgTap({ imgName: 'scriptImg_1598597914633' });

    await swipeAction(op, 'up');

    /** 选择资源 */
    photoElement = await findAndInitSelfElementObj(op, 'appium|id', 'com.imo.android.imoimalpha:id/phone_gallery_check', null, resourceIndex);
    await press(op, photoElement);
    /** 发送 */
    await op.imgTap({ imgName: 'scriptImg_1598602107974' });

    /** 装备msgObj */
    msgObj.imgName = imgName;
    return msgObj;
}

/**
 * 发送文件类的消息
 * @param {*} op 被操作的设备
 * @param {*} fileType 待发送文件类型 : audio|file
 * @param {*} imgName 所发送文件在图像识别中的标识
 * @returns 已发送的msgObj：
 *                      imgName：链接解析完成后，图像识别的样式
 */
async function sendBGFileMsgAction(op, fileType, imgName) {
    /** 初始化msgObj */
    let msgObj = new Object();
    /** 操作 */
    /** 进入文件界面 */
    await enterClipView(op, 'file');

    /** 选择文件类型进行发送 */
    switch (fileType) {
        case 'audio':
            {
                await op.imgTap({ imgName: 'scriptImg_1598603538127' });
                await op.imgTap({ imgName: 'scriptImg_1598585999641' });
            }
            break;
        case 'file':
            {
                await op.imgTap({ imgName: 'scriptImg_1598603705054' });
                await op.imgTap({ imgName: 'scriptImg_1598586009529' });
            }
            break;
    }

    /** 发送 */
    await op.imgTap({ imgName: 'scriptImg_1598603579123' });

    /** 装备msgObj */
    msgObj.imgName = imgName;
    return msgObj;
}

/**
 * 唤醒大群回复消息的操作
 * @param {*} op 设备
 */
async function awakeBGReplyMsgAction(op) {
    let replyBtn, opeartorView, replyContainer, replyTarget, targetName, msgObj;
    /** 打开操作窗口 */
    opeartorView = await awakeOperationView(op);

    /** 点击回复 */
    replyBtn = await findAndInitSelfElementObj(op, 'unq|', 'scriptImg_1598440903933', opeartorView);
    await press(op, replyBtn);

    /** 检查回复消息的样式 */
    replyContainer = await findAndInitSelfElementObj(op, 'appium|id', 'com.imo.android.imoimalpha:id/rl_reply_container');
    if (replyContainer.element == null) {
        await op.stepTag('没有出现回复消息的样式');
    }

    // /** 检查文本框中是否有‘@xxx’的字样 */
    // replyTarget = await findAndInitSelfElementObj(op,"appium|id","com.imo.android.imoimalpha:id/chat_input");
    // targetName = await replyTarget.element.text();
    // if (targetName.indexOf("@") == -1){
    //     await op.stepTag('输入框中，没有出现回复消息的样式：‘@xxx’');
    // }
}

/**
 * 分享消息
 * @param {*} op 被操作的设备
 * @param {*} target 分享的目标
 * @param {*} imgName 分享的内容，可以是分享的内容的图像识别标识，也可以是文本
 */
async function shareBGMsgAction(op, target, imgName) {
    /** 打开操作窗口 */
    await awakeOperationView(op);

    /** 点击分享 */
    await op.imgTap({ imgName: 'scriptImg_1598450933414' });

    /** 分享 */
    let msgObj = await shareAction(op, target, imgName);
    await op.back();
    return msgObj;
}

/**
 * 下载操作
 * @param {*} op 被操作的设备；
 * @param {*} downLoadType 需要下载的文件类型：img|video|audio|file
 */
async function downloadBGMsgAction(op, downLoadType) {
    let startNum, endNum, dowloadBtn, operatorView;
    /** 上滑 */
    await swipeAction(hostOp, 'up', await getSpace(hostOp, 'window'));

    switch (downLoadType) {
        case 'img':
            {
                /** 获取起始资源数量 */
                startNum = await checkBGImageDowload(op);
                /** 唤醒操作窗口 */
                operatorView = await awakeOperationView(op);
                /** 点击下载 */
                downloadBtn = await findAndInitSelfElementObj(op, 'unq|', 'scriptImg_1598599499458', operatorView);
                await press(op, dowloadBtn);
                /** 获取下载后的资源数量 */
                endNum = await checkBGImageDowload(op);
            }
            break;
        case 'video':
            {
                /** 获取起始资源数量 */
                startNum = await checkBGFileDownLoad(op, 'video');
                /** 唤醒操作窗口 */
                operatorView = await awakeOperationView(op);
                /** 点击下载 */
                downloadBtn = await findAndInitSelfElementObj(op, 'unq|', 'scriptImg_1598599499458', operatorView);
                await press(op, dowloadBtn);
                /** 获取下载后的资源数量 */
                endNum = await checkBGFileDownLoad(op, 'video');
            }
            break;
        case 'audio':
            {
                /** 获取起始资源数量 */
                startNum = await checkBGFileDownLoad(op, 'audio');
                /** 操作下载 */
                await BGFileDownLoadAction(op);
                /** 获取下载后的资源数量 */
                endNum = await checkBGFileDownLoad(op, 'audio');
            }
            break;
        case 'file': {
            /** 获取起始资源数量 */
            startNum = await checkBGFileDownLoad(op, 'file');
            /** 操作下载 */
            await BGFileDownLoadAction(op);
            /** 获取下载后的资源数量 */
            endNum = await checkBGFileDownLoad(op, 'file');
        }
    }

    /** 检查 */
    if (parseInt(endNum) - parseInt(startNum) != 1) {
        await op.stepTag('下载失败，开始的时候，有 ' + startNum + ' 个document，结束的时候有 ' + endNum + ' 个document');
    }
}

/**
 * 文件下载功能
 * @param {*} op 被操作的设备
 */
async function BGFileDownLoadAction(op) {
    let downLoadTarget, downloadingOjb;
    /** 获取聊天界面最后一个聊天tab */
    downLoadTarget = await findAndInitSelfElementObj(op, 'appium|id', 'com.imo.android.imoimalpha:id/rv_record', null, -1);
    /** 点击进入文件详情页 */
    await pressByCoordinate(op, msgReply.space.centerX + msgReply.space.width / 4, msgReply.space.centerY);
    /** 点击下载 */
    await op.imgTap({ imgName: 'scriptImg_1598453783204' });

    /**获取下载状态 */
    downloadingOjb = await findAndInitSelfElementObj(op, 'unq|', 'scriptImg_1598453674110');
    /** 等待下载完成 */
    while (documentObj.element != null) {
        await sleepAction(5000);
        documentObj = await findAndInitSelfElementObj(op, 'unq|', 'scriptImg_1598453674110');
    }

    /** 返回聊天界面 */
    await op.back();
}

/**
 * 唤醒更多操作小弹窗
 * @param {*} op 被操作的设备
 * @returns 弹窗对象
 */
async function awakeOperationView(op) {
    /** 上滑 */
    await swipeAction(op, 'up');
    /** 获取聊天界面最后一个聊天tab */
    let msgReply = await findAndInitSelfElementObj(op, 'appium|id', 'com.imo.android.imoimalpha:id/rv_record', null, -1);

    /** 长按3秒，唤出操作弹窗 */
    await pressByCoordinate(op, msgReply.space.centerX + msgReply.space.width / 4, msgReply.space.centerY, 3);

    /** 获取弹窗对象 */
    let operatorView = await findAndInitSelfElementObj(op, 'appium|id', 'com.imo.android.imoimalpha:id/lv');
    return operatorView;
}

/**
 * 进入到曲别针区域的特定功能界面
 * @param {*} op 被操作的设备
 * @param {*} clipType 曲别针区域的功能入口，目前支持：gallery|file
 */
async function enterClipView(op, clipType) {
    let controlView, clipBtn, galleryEntrance, fileEntrance, checkSpace;
    controlView = await findAndInitSelfElementObj(op, 'appium|id', 'com.imo.android.imoimalpha:id/rv_record');
    clipBtn = await findAndInitSelfElementObj(op, 'unq|', 'scriptImg_1598431132748', controlView);

    /** 在屏幕的下半区域查找是否有相册或者文件入口，没有就点击曲别针 */
    checkSpace = await splitAndGetSearchSpace(await getSpace(op, 'window'), 0, 1, 0.5, 1);
    galleryEntrance = await findAndInitSelfElementObj(op, 'unq|', 'scriptImg_1595298753338', checkSpace);
    if (galleryEntrance.element == null) {
        await press(op, clipBtn);
    }

    /** 进入到对应的界面 */
    switch (clipType) {
        case 'gallery':
            {
                galleryEntrance = await findAndInitSelfElementObj(op, 'unq|', 'scriptImg_1595298753338', checkSpace);
                await press(op, galleryEntrance);
            }
            break;
        case 'file':
            {
                fileEntrance = await findAndInitSelfElementObj(op, 'unq|', 'scriptImg_1598434609602', checkSpace);
                await press(op, fileEntrance);
            }
            break;
    }
}

/** =============================================================== */
/** =========================== 检查消息 ============================= */
/** =============================================================== */

/**
 * 检查文本消息
 * @param {*} hostOp 发送消息的设备
 * @param {*} guestOp 收取消息的设备
 * @param {*} msgObj 发送消息的msgObj
 */
async function checkBGTextMsgAction(hostOp, guestOp, msgObj) {
    let lastMsg, msgContent;

    /** 主设备检查 */
    /** 获取聊天界面上最后一个聊天信息 */
    lastMsg = await findAndInitSelfElementObj(hostOp, 'appium|id', 'com.imo.android.imoimalpha:id/x_item_content_view_root', null, -1);
    /** 获取文本内容，并对比 */
    msgContent = await findAndInitSelfElementObj(hostOp, 'appiumParent|id', 'com.imo.android.imoimalpha:id/tv_message', lastMsg);
    await assertMsgText(hostOp, await msgContent.element.text(), msgObj.text);
    /** 对比消息状态 */
    await assertStutas(hostOp, lastMsg);

    /** 副设备检查 */
    /** 获取聊天界面上最后一个聊天信息 */
    lastMsg = await findAndInitSelfElementObj(guestOp, 'appium|id', 'com.imo.android.imoimalpha:id/x_item_content_view_root', null, -1);
    /** 获取文本内容，并对比 */
    msgContent = await findAndInitSelfElementObj(guestOp, 'appiumParent|id', 'com.imo.android.imoimalpha:id/tv_message', lastMsg);
    await assertMsgText(guestOp, await msgContent.element.text(), msgObj.text);
}

/**
 * 检查音频消息
 * @param {*} hostOp 发送消息的设备
 * @param {*} guestOp 收取消息的设备
 * @param {*} msgObj 发送消息的msgObj
 */
async function checkBGAudioMsgAction(hostOp, guestOp, msgObj) {
    let lastMsg, msgContent, msgStatus;

    /** 主设备检查 */
    /** 获取聊天界面上最后一个聊天信息 */
    lastMsg = await findAndInitSelfElementObj(hostOp, 'appium|id', 'com.imo.android.imoimalpha:id/x_item_content_view_root', null, -1);
    /** 获取文本内容，并对比 */
    msgContent = await findAndInitSelfElementObj(hostOp, 'appiumParent|id', 'com.imo.android.imoimalpha:id/tv_duration', lastMsg);
    await assertMsgTime(hostOp, await msgContent.element.text(), msgObj.text);
    /** 对比消息状态 */
    await assertStutas(hostOp, lastMsg);

    /** 副设备检查 */
    /** 获取聊天界面上最后一个聊天信息 */
    lastMsg = await findAndInitSelfElementObj(guestOp, 'appium|id', 'com.imo.android.imoimalpha:id/x_item_content_view_root', null, -1);
    /** 获取文本内容，并对比 */
    msgContent = await findAndInitSelfElementObj(guestOp, 'appiumParent|id', 'com.imo.android.imoimalpha:id/tv_duration', lastMsg);
    await assertMsgTime(guestOp, await msgContent.element.text(), msgObj.text);
}

/**
 * 检查可以使用图片识别检查的一类消息
 * @param {*} hostOp 发送消息的设备
 * @param {*} guestOp 收取消息的设备
 * @param {*} msgObj 发送消息的msg
 */
async function checkBGImgMsgAction(hostOp, guestOp, msgObj) {
    let targetMsg, msgImg, msgTime;
    /**  *********** 一、检查主设备  *********** */
    /** 上滑 */
    await swipeAction(hostOp, 'up');
    targetMsg = await findAndInitSelfElementObj(hostOp, 'appium|id', 'com.imo.android.imoimalpha:id/x_item_content_view_root', null, -1);
    /** 1、检查发送的内容 */
    msgImg = await findAndInitSelfElementObj(hostOp, 'unq|', msgObj.imgName, targetMsg);
    if (msgImg.element == null) {
        await hostOp.stepTag('主设备-img 元素找不到 ');
    }
    /** 2、检查状态 */
    await assertStutas(hostOp, targetMsg);

    /** *********** 二、检查副设备 *********** */
    /** 上滑 */
    await swipeAction(guestOp, 'up');
    targetMsg = await findAndInitSelfElementObj(guestOp, 'appium|id', 'com.imo.android.imoimalpha:id/x_item_content_view_root', null, -1);
    /** 1、检查发送的内容 */
    msgImg = await findAndInitSelfElementObj(guestOp, 'unq|', msgObj.imgName, targetMsg);
    if (msgImg.element == null) {
        await guestOp.stepTag('副设备-img 元素找不到 ');
    }
}

/**
 * 检查回复类消息
 * @param {*} hostOp 回复消息的设备
 * @param {*} guestOp 收取消息的设备
 * @param {*} msgObj 回复消息的msg
 */
async function checkBGReplyMsgAction(hostOp, guestOp, checkText, msgObj) {
    let targetMsg, replyContainer, textContent, targetText;
    /**  *********** 一、检查主设备  *********** */
    /** 上滑 */
    await swipeAction(hostOp, 'up');
    targetMsg = await findAndInitSelfElementObj(hostOp, 'appium|id', 'com.imo.android.imoimalpha:id/x_item_content_view_root', null, -1);

    /** 1、检查已发送的消息中，最新一条是否有回复消息的样式 */
    replyContainer = await findAndInitSelfElementObj(hostOp, 'appiumParent|id', 'com.imo.android.imoimalpha:id/top_reply_container', targetMsg);
    if (replyContainer.element == null) {
        await hostOp.stepTag('主设备-已发送的消息中，没有出现回复消息的样式');
    }

    /** 2、检查文字 */
    if (checkText) {
        textContent = await findAndInitSelfElementObj(hostOp, 'appiumParent|id', 'com.imo.android.imoimalpha:id/reply_text_tv', replyContainer);
        if (textContent.element == null) {
            await hostOp.stepTag('主设备-已发送的消息中，找不到对应的文本');
        } else {
            targetText = await textContent.element.text();
            if (targetText.indexOf(msgObj.text) == -1) {
                await hostOp.stepTag('主设备-已发送的消息中，发送的文本对不上');
            }
        }
    }

    /**  *********** 一、检查副设备  *********** */
    /** 上滑 */
    await swipeAction(guestOp, 'up');
    targetMsg = await findAndInitSelfElementObj(guestOp, 'appium|id', 'com.imo.android.imoimalpha:id/x_item_content_view_root', null, -1);

    /** 1、检查已收取的消息中，最新一条是否有回复消息的样式 */
    replyContainer = await findAndInitSelfElementObj(guestOp, 'appiumParent|id', 'com.imo.android.imoimalpha:id/top_reply_container', targetMsg);
    if (replyContainer.element == null) {
        await guestOp.stepTag('副设备-已收取的消息中，没有出现回复消息的样式');
    }

    /** 2、检查文字 */
    if (checkText) {
        textContent = await findAndInitSelfElementObj(guestOp, 'appiumParent|id', 'com.imo.android.imoimalpha:id/reply_text_tv', replyContainer);
        if (textContent.element == null) {
            await guestOp.stepTag('副设备-已发送的消息中，找不到对应的文本');
        } else {
            targetText = await textContent.element.text();
            if (targetText.indexOf(msgObj.text) == -1) {
                await guestOp.stepTag('副设备-已发送的消息中，发送的文本对不上');
            }
        }
    }
}

/**
 * 检查分享类消息
 * @param {*} op 分享内容的设备
 * @param {*} msgObj 分享的内容
 * @param {*} backName 需要返回的界面
 */
async function checkBGShareAction(op, msgObj, backName) {
    let targetMsg, msgImg, msgText, msgTime;

    /** 回到首页 */
    await op.back();

    /**进入到被分享的人的聊天界面 */
    await enterTargetChatView(op, msgObj.target);
    if (msgObj.imgName.indexOf('scriptImg_') != -1) {
        /**  *********** 一、检查主设备  *********** */
        /** 上滑 */
        await swipeAction(op, 'up');
        targetMsg = await findAndInitSelfElementObj(op, 'appium|id', 'com.imo.android.imoimalpha:id/x_item_content_view_root', null, -1);
        /** 1、检查发送的内容 */
        msgImg = await findAndInitSelfElementObj(op, 'unq|', msgObj.imgName, targetMsg);
        if (msgImg.element == null) {
            await hostOp.stepTag('主设备-分享的img 元素找不到 ');
        }
        /** 2、检查状态 */
        await assertStutas(op, targetMsg);
    } else {
        /**  *********** 一、检查主设备  *********** */
        /** 上滑 */
        await swipeAction(op, 'up');
        targetMsg = await findAndInitSelfElementObj(op, 'appium|id', 'com.imo.android.imoimalpha:id/x_item_content_view_root', null, -1);

        /** 1、检查字符串是否相等 */
        msgText = await targetMsg.element.element('id', 'com.imo.android.imoimalpha:id/tv_message');
        await assertMsgText(op, await msgText.text(), msgObj.imgName);

        /** 2、检查是否存在msg status */
        await assertStutas(op, targetMsg);
    }
    /** 回去原来的界面 */
    await op.back();
    await enterTargetChatView(op, backName);
}

/**
 * 检查视频、音频、文档类的消息的下载
 * @param {*} op 被操作的设备
 * @param {*} fileType 文件类型 video|audio|file
 * @returns num 当前这类型的文件有多少个
 */
async function checkBGFileDownLoad(op, fileType) {
    let numObj, num;
    /** 进入文件 */
    await enterClipView(op, 'file');

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
    num = parseInt(await numObj.element.text().split(' ')[0]);

    /** 返回聊天界面 */
    await op.back();
    return num;
}

/**
 * 检查相片类消息的下载
 * @param {*} op 被操作的设备
 * @returns num 当前IMO文件夹下有多少个资源
 */
async function checkBGImageDowload(op) {
    let operatorElement, albumEntrance, nubObj, num;

    /** 进入相册界面 */
    await enterClipView(op, 'gallery');

    /** 进入相册文件夹 */
    await op.imgTap({ imgName: 'scriptImg_1598597898214' });

    /** 获取IMO文件夹的数量 */
    numObj = await findAndInitSelfElementObj(op, 'appium|xpath', "//android.widget.TextView[@text='imo']/following-sibling::android.widget.TextView");
    num = await nubObj.element.text();
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
        "//android.widget.ImageView[contains(@resource-id,'iv_mes_state') or contains(@resource-id,'com.imo.android.imoimalpha:id/iv_file_status')]",
        targetMsg
    );
    if (msgStatus.element == null) {
        await op.stepTag('该消息没有找到status');
    }
}

/** =============================================================== */
/** ========================== 群空间相关  ============================ */
/** =============================================================== */

/**
 * 从相册中选择资源进行群空间发送
 * @param {*} op 被操作的设备
 * @param {*} postType 发送资源类型 photo|video|text
 * @param {*} imageName 资源被图像识别后的标识
 * @returns checkObj 包含字段为：
 *                                                  checkType：检查的类型，即传入的postType
 *                                                  time：发布群空间的时间
 *                                                  imageName：发搜图片或视频资源的群空间时，需要使用到的内容，即传入的imageName
 *                                                  text：发布纯文字内容时，会获取到的信息
 */
async function postAlbumZone(op, postType, imageName) {
    let searchSpace, targetObj;
    /** 初始化返回值 */
    let checkObj = new Object();

    /** 点击进入发布群空间界面 */
    targetObj = await findAndInitSelfElementObj(op, 'unq|', 'scriptImg_1599813027541', searchSpace);
    await press(op, targetObj);

    /** 点击选择从相册中添加资源 */
    searchSpace = await splitAndGetSearchSpace(await getSpace(op, 'window'), 0, 1, 0.5, 1);
    targetObj = await findAndInitSelfElementObj(op, 'unq|', 'scriptImg_1599815036069', searchSpace);
    await press(op, targetObj);

    /** 进入相册文件夹 */
    await op.imgTap({ imgName: 'scriptImg_1598597898214' });

    /** 进入Camera这个文件夹 */
    await op.imgTap({ imgName: 'scriptImg_1598597914633' });

    /** 上划，防止有资源被隐藏 */
    await swipeAction(op, 'up');

    switch (postType) {
        case 'photo':
            {
                /** 选择资源 */
                targetObj = await findAndInitSelfElementObj(op, 'appium|id', 'com.imo.android.imoimalpha:id/phone_gallery_check', null, 0);
                await press(op, targetObj);
                checkObj.checkType = 'photo';
                checkObj.imgName = imageName;
            }
            break;
        case 'video':
            {
                /** 选择资源 */
                targetObj = await findAndInitSelfElementObj(op, 'appium|id', 'com.imo.android.imoimalpha:id/phone_gallery_check', null, 1);
                await press(op, targetObj);
                checkObj.imgName = imageName;
                checkObj.checkType = 'video';
            }
            break;
        case 'text':
            {
                /** 选择资源 */
                targetObj = await findAndInitSelfElementObj(op, 'appium|id', 'com.imo.android.imoimalpha:id/phone_gallery_check', null, 1);
                await press(op, targetObj);
                /** 删除资源 */
                targetObj = await findAndInitSelfElementObj(op, 'appium|id', 'com.imo.android.imoimalpha:id/iv_delete');
                await press(op, targetObj);
                /** 填写随机文字内容 */
                targetObj = await findAndInitSelfElementObj(op, 'appium|id', 'com.imo.android.imoimalpha:id/et_content');
                checkObj.text = await getInputString('IN', 200);
                await targetObj.element.type(checkObj.text);
                checkObj.checkType = 'text';
            }
            break;
    }
    /** 发布单图群空间 */
    await op.imgTap({ imgName: 'scriptImg_1599814764533' });
    checkObj.time = await getTime();

    await sleepAction(5000);

    return checkObj;
}

/**
 * 检查群空间是否已被发送
 * @param {*} op 被操作的设备
 * @param {*} checkObj 发送群空间时，返回的checkObj
 */
async function checkZonePost(op, checkObj) {
    let targetObj;
    switch (checkObj.checkType) {
        case 'photo':
            {
                /** 检查是否发送成功 */
                targetObj = await findAndInitSelfElementObj(op, 'appium|id', 'com.imo.android.imoimalpha:id/tv_time');
                await assertMsgTime(op, await targetObj.element.text(), checkObj.time);
                if (!(await op.imgExist({ imgName: checkObj.imgName }))) {
                    await op.stepTag('没有找到刚刚发送的图片');
                }
            }
            break;
        case 'video':
            {
                /** 检查是否发送成功 */
                targetObj = await findAndInitSelfElementObj(op, 'appium|id', 'com.imo.android.imoimalpha:id/tv_time');
                await assertMsgTime(op, await targetObj.element.text(), checkObj.time);
                if (!(await op.imgExist({ imgName: checkObj.imgName }))) {
                    await op.stepTag('没有找到刚刚发送的视频');
                }
            }
            break;
        case 'text': {
            /** 检查是否发送成功 */
            targetObj = await findAndInitSelfElementObj(op, 'appium|id', 'com.imo.android.imoimalpha:id/tv_time');
            await assertMsgTime(op, await targetObj.element.text(), checkObj.time);
            targetObj = await findAndInitSelfElementObj(op, 'appium|id', 'com.imo.android.imoimalpha:id/tv_content');
            await assertMsgText(op, await targetObj.element.text(), checkObj.text);
        }
    }
}

module.exports = {
    closeBigGroupPopWindow,
    sendBGTextMsgAction,
    sendBGAudioMsgAction,
    sendBGLinkMsgAction,
    sendBGStickerMsgAction,
    sendBGAlbumMsgAction,
    sendBGFileMsgAction,
    awakeBGReplyMsgAction,
    shareBGMsgAction,
    downloadBGMsgAction,
    checkBGTextMsgAction,
    checkBGAudioMsgAction,
    checkBGImgMsgAction,
    checkBGReplyMsgAction,
    checkBGShareAction,
    postAlbumZone,
    checkZonePost,
};
