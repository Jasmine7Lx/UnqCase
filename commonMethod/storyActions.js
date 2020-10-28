const { splitAndGetSearchSpace, findAndInitSelfElementObj, getSpace, press, sleepAction, swipeAction, assertMsgText, pressByCoordinate } = require('../commonMethod/baseActions');

/**
 * 发送 Story
 * @param {*} op 被操作的设备
 * @param {*} resourceType 发送story的资源类型：takePhoto | takeVideo | selectPhoto | selectVideo | multi
 * @param {*} sendWay 发送story的选项：story | FOF
 * @param {*} needPaint 是否需要涂鸦，不传或者传false都是标识不涂鸦
 */
async function postStory(op, resourceType, sendWay, needPaint) {
    /** 定义需要使用的变量 */
    let searchSpace, targetObj, assistNum, storyNum;

    /**1、矫正Story 发布入口 */
    targetObj = await correctStory(op);
    /** 2、获取发布前的Story数量 */
    storyNum = await getStoryNum(op, 'My Story');

    /** 3、进入入口 */
    await press(op, targetObj);

    /** 4、根据 resourceType 判断前置操作 */
    if (resourceType.indexOf('take') != -1) {
        /** 选择拍摄功能 */
        searchSpace = await splitAndGetSearchSpace(await getSpace(op, 'window'), 0.6, 1, 0.6, 1);
        targetObj = await findAndInitSelfElementObj(op, 'unq|', 'scriptImg_1598405796627', searchSpace);
        await press(op, targetObj);
        /** 拍摄照片 */
        searchSpace = await splitAndGetSearchSpace(await getSpace(op, 'window'), 0.3, 0.8, 0.7, 1);
        targetObj = await findAndInitSelfElementObj(op, 'unq|', 'scriptImg_1600160750388', searchSpace);
    } else if (resourceType.indexOf('select') != -1) {
        /** 进入相册文件夹 */
        await op.imgTap({ imgName: 'scriptImg_1598597898214' });
        /** 进入Camera这个文件夹 */
        await op.imgTap({ imgName: 'scriptImg_1598597914633' });
        await swipeAction(op, 'up');
    } else {
        /** 开启多选功能 */
        searchSpace = await splitAndGetSearchSpace(await getSpace(op, 'window'), 0, 1, 0.7, 1);
        targetObj = await findAndInitSelfElementObj(op, 'unq|', 'scriptImg_1600164845805', searchSpace);
        await press(op, targetObj);
    }

    assistNum = 1;

    /** 5、进入发布页 */
    switch (resourceType) {
        case 'takePhoto':
            await press(op, targetObj);
            break;
        case 'takeVideo':
            await press(op, targetObj, 5);
            break;
        case 'selectPhoto':
            {
                targetObj = await findAndInitSelfElementObj(
                    op,
                    'appium|xpath',
                    "//androidx.recyclerview.widget.RecyclerView[@resource-id='com.imo.android.imoimalpha:id/media_grid']/android.widget.FrameLayout",
                    null,
                    0
                );
                await press(op, targetObj);
            }
            break;
        case 'selectVideo':
            {
                targetObj = await findAndInitSelfElementObj(
                    op,
                    'appium|xpath',
                    "//androidx.recyclerview.widget.RecyclerView[@resource-id='com.imo.android.imoimalpha:id/media_grid']/android.widget.FrameLayout",
                    null,
                    1
                );
                await press(op, targetObj);
            }
            break;
        case 'multi': {
            for (let index = 0; index < 5; index++) {
                targetObj = await findAndInitSelfElementObj(op, 'appium|id', 'com.imo.android.imoimalpha:id/phone_gallery_check', null, 0);
                await press(op, targetObj);
            }
            searchSpace = await splitAndGetSearchSpace(await getSpace(op, 'window'), 0.5, 1, 0.7, 1);
            targetObj = await findAndInitSelfElementObj(op, 'unq|', 'scriptImg_1600167591645', searchSpace);
            await press(op, targetObj);
            assistNum = 5;
        }
    }

    /** 6、判断是否需要涂鸦 */
    if (needPaint != undefined && needPaint != false) {
        /** 进入涂鸦界面 */
        searchSpace = await splitAndGetSearchSpace(await getSpace(op, 'window'), 0.5, 1, 0, 0.2);
        targetObj = await findAndInitSelfElementObj(op, 'unq|true', 'scriptImg_1600167435452', searchSpace);
        await press(op, targetObj);
        /** 涂鸦 */
        await swipeAction(op, 'up');
        /** 保存 */
        searchSpace = await splitAndGetSearchSpace(await getSpace(op, 'window'), 0.7, 1, 0, 0.2);
        targetObj = await findAndInitSelfElementObj(op, 'unq|', 'scriptImg_1600167591645', searchSpace);
        await press(op, targetObj);
    }

    /** 7、发送到My Story */
    if (sendWay == 'story') {
        searchSpace = await splitAndGetSearchSpace(await getSpace(op, 'window'), 0.7, 1, 0.7, 1);
        targetObj = await findAndInitSelfElementObj(op, 'unq|', 'scriptImg_1602755078707', searchSpace);
        await press(op, targetObj);
    } else if (sendWay == 'FOF') {
        searchSpace = await splitAndGetSearchSpace(await getSpace(op, 'window'), 0, 1, 0.7, 1);
        targetObj = await findAndInitSelfElementObj(op, 'unq|', 'scriptImg_1602754772068', searchSpace);
        await press(op, targetObj);
        await sleepAction(2000);
        searchSpace = await splitAndGetSearchSpace(await getSpace(op, 'window'), 0, 1, 0.4, 0.8);
        targetObj = await findAndInitSelfElementObj(op, 'unq|', 'scriptImg_1602821503407', searchSpace);
        if (targetObj.element != null) {
            searchSpace = await splitAndGetSearchSpace(await getSpace(op, 'window'), 0, 1, 0.4, 0.8);
            let closeObj = await findAndInitSelfElementObj(op, 'unq|', 'scriptImg_1602821514222', searchSpace);
            await press(op, closeObj);
        }
    }

    /** 8、等待发送完成 */
    await sleepAction(5000);

    /** 判断是否发送成功 */
    storyNumObj = await findAndInitSelfElementObj(
        op,
        'appium|xpath',
        "//android.widget.TextView[@resource-id='com.imo.android.imoimalpha:id/name' and @text='My Story']/preceding-sibling::android.widget.TextView"
    );
    if (storyNumObj.element == null) {
        await op.stepTag('发布新story 到' + sendWay + '后，My Story项没有排到第一');
    } else if (parseInt(await storyNumObj.element.text()) - parseInt(storyNum) != assistNum) {
        await op.stepTag('发布新story 到' + sendWay + '后，My Story的未读数量没有增加 ' + assistNum);
    }
}

/**
 * 获取未读Story的数量
 * @param {*} op 被操作的设备
 * @param targetName 目标的昵称
 */
async function getStoryNum(op, targetName) {
    let assistObj, assistNum, storyNumObj, storyNum;
    assistObj = await findAndInitSelfElementObj(op, 'appium|id', 'com.imo.android.imoimalpha:id/stories');
    /** 开始发布前，获取目标 Story 有多少个未读 */
    storyNumObj = await findAndInitSelfElementObj(op, 'appium|xpath', "//android.widget.TextView[@resource-id='com.imo.android.imoimalpha:id/name' and @text='" + targetName + "']");
    assistNum = 0;
    while (storyNumObj.element == null) {
        await swipeAction(op, 'left', assistObj.space);
        storyNumObj = await findAndInitSelfElementObj(op, 'appium|xpath', "//android.widget.TextView[@resource-id='com.imo.android.imoimalpha:id/name' and @text='" + targetName + "']");
        assistNum++;
        if (assistNum > 10) {
            break;
        }
    }
    /** My Story 元素存在时，获取未读Story的数量 */
    if (assistNum <= 10) {
        storyNumObj = await findAndInitSelfElementObj(
            op,
            'appium|xpath',
            "//android.widget.TextView[@resource-id='com.imo.android.imoimalpha:id/name' and @text='" + targetName + "']/preceding-sibling::android.widget.TextView"
        );
        if (storyNumObj.element != null) {
            storyNum = await storyNumObj.element.text();
        } else {
            storyNum = 0;
        }
    } else {
        storyNum = 0;
    }
    /** 回到发布story界面 */
    await correctStory(op);
    return storyNum;
}

/**
 * 查找对应的Story
 * @param {*} op 被操作的设备
 * @param {*} targetName 被查找的Story 名
 */
async function searchStory(op, targetName) {
    let assistObj, assistNum, storyNumObj, storyNum;
    /** 获取Story模块的区域 */
    assistObj = await findAndInitSelfElementObj(op, 'appium|id', 'com.imo.android.imoimalpha:id/stories');
    /** 根据名字来查找对应的Story */
    storyNumObj = await findAndInitSelfElementObj(op, 'appium|xpath', "//android.widget.TextView[@resource-id='com.imo.android.imoimalpha:id/name' and @text='" + targetName + "']");
    assistNum = 0;
    while (storyNumObj.element == null) {
        await swipeAction(op, 'left', assistObj.space);
        storyNumObj = await findAndInitSelfElementObj(op, 'appium|xpath', "//android.widget.TextView[@resource-id='com.imo.android.imoimalpha:id/name' and @text='" + targetName + "']");
        assistNum++;
        if (assistNum > 10) {
            storyNum = 0;
            break;
        }
    }
    return storyNumObj;
}

/**
 * 矫正界面，通过向右滑动使得story发布入口出现在界面上
 * @param {*} op 被操作的设备
 * @returns Story发布入口Object
 */
async function correctStory(op) {
    /** 定义需要使用的变量 */
    let targetObj, assistObj;
    assistObj = await findAndInitSelfElementObj(op, 'appium|id', 'com.imo.android.imoimalpha:id/stories');
    targetObj = await findAndInitSelfElementObj(op, 'unq|', 'scriptImg_1600152562206', assistObj);
    assistNum = 0;
    while (targetObj.element == null) {
        await swipeAction(op, 'right', assistObj.space);
        targetObj = await findAndInitSelfElementObj(op, 'unq|', 'scriptImg_1600152562206', assistObj);
        assistNum++;
        if (assistNum > 10) {
            await op.stepTag('矫正失败，找不到发送Story的入口');
            break;
        }
    }
    return targetObj;
}

module.exports = {
    postStory,
    getStoryNum,
    searchStory,
    correctStory,
};
