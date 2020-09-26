/**
 * 将原始的区域进行拆分，获取原始区域的某一部分，用于UNQ图像识别查找
 * @param {*} oringnalSpace 初始的区域
 * @param {*} startW 百分比，从宽的百分比开始算
 * @param {*} endW 百分比，在宽的百分比中结束
 * @param {*} startH 百分比，从高度的百分比中开始算
 * @param {*} endH 百分比，在高度的百分比中结束
 * @returns 返回的对象，字段说明如下：
 *            space：处理完的区域
 */
async function splitAndGetSearchSpace(oringnalSpace, startW, endW, startH, endH) {
    let space = new Object();
    space.leftTopX = oringnalSpace.leftTopX + oringnalSpace.width * startW;
    space.leftTopY = oringnalSpace.leftTopY + oringnalSpace.height * startH;
    space.width = oringnalSpace.width * (endW - startW);
    space.height = oringnalSpace.height * (endH - startH);
    space.centerX = space.x + space.width / 2;
    space.centerY = space.y + space.height / 2;
    return space;
}

/**
 * 初始化自定义的对象，用于测试
 * @param {*} op 操作的设备
 * @param {*} findWay 查找方法，支持以下类型：'unq|'、'appium|way（id，xpath等）'、'appiumParent|way（id，xpath等）'
 * @param {*} identification 查找的元素标识
 * @param {*} parentObj 上级元素的Obj，用于界定查找范围；如果是unq查找的话，可以直接传入space 的Obj
 * @param {*} index 当界面的元素为多个时，需要填写需要返回数组中第几个元素（0开始计数）；默认是返回第一个，如果想返回最后一个，请填入-1
 * @returns 返回的对象，字段说明如下：
 *            desc：该元素是使用哪种方法找到的
 *            element：找到的元素实例，默认是null
 *            space：找到的元素的space，默认是null
 *            inWindowLocation：找到的元素在界面上的位置
 *            size：找到了多少个同类型的元素
 */
async function findAndInitSelfElementObj(op, findWay, identification, parentObj, index = 0) {
    let selfObj = new Object();
    let way, element, targetElement, targetSpace, parentSpace;
    /** 拆分 findway */
    if (findWay.indexOf('|') != -1) {
        way = findWay.split('|');
    }

    /** 初始化selfObj的属性 */
    selfObj.desc = way[0];
    selfObj.element = null;
    selfObj.space = null;
    selfObj.inWindowLocation = null;
    selfObj.size = 0;

    /** 查找element，将找到的element装入数组：elementArray */
    try {
        switch (way[0]) {
            case 'unq':
                {
                    if (parentObj == undefined) {
                        parentSpace = await getSpace(op, 'window');
                    } else if (parentObj.space == undefined || parentObj.space == null) {
                        parentSpace = parentObj;
                    } else {
                        parentSpace = parentObj.space;
                    }
                    targetElement = await op.imgRecognize({
                        imgName: identification,
                        assignX: parentSpace.leftTopX,
                        assignY: parentSpace.leftTopY,
                        assignWidth: parentSpace.width,
                        assignHeight: parentSpace.height,
                    });
                    targetSpace = await getSpace(op, 'unq', targetElement);
                    selfObj.size = 1;
                }
                break;
            case 'appium':
                {
                    await op.driver.setImplicitWaitTimeout(3000);
                    element = await op.driver.elements(way[1], identification);
                    /** 判断index是否要找最后一个元素 */
                    if (index == -1) {
                        targetElement = element[element.length - 1];
                    } else {
                        targetElement = element[index];
                    }
                    targetSpace = await getSpace(op, 'appium', targetElement);
                    selfObj.size = element.length;
                }
                break;
            case 'appiumParent':
                {
                    await op.driver.setImplicitWaitTimeout(3000);
                    element = await parentObj.element.elements(way[1], identification);
                    /** 判断index是否要找最后一个元素 */
                    if (index == -1) {
                        targetElement = element[element.length - 1];
                    } else {
                        targetElement = element[index];
                    }
                    targetSpace = await getSpace(op, 'appium', targetElement);
                    selfObj.size = element.length;
                }
                break;
        }

        /** 将找到的元素装入 */
        selfObj.element = targetElement;
        selfObj.space = targetSpace;
        selfObj.inWindowLocation = getWindowLocation(op, targetSpace);
    } catch (err) {
        op.stepTag('此处出现异常 : ' + err);
    }

    return selfObj;
}

/**
 * 根据元素的中心来判断在界面上的哪个位置，获取百分比，用于判断元素的位置
 * @param {*} op
 * @param {*} elementSpace 元素的space对象
 * @returns 返回的对象，字段说明如下：
 *            widthLocat：该元素的中心位于界面上宽度的百分几
 *            heightLocat：该元素的中心位于界面上高度的百分几
 */
async function getWindowLocation(op, elementSpace) {
    let windowLocation = new Object();
    let window = await getSpace(op, 'window');
    /** 根据元素的中心来判断在界面上的哪个位置，获取百分比，用于判断元素的位置 */
    windowLocation.widthLocat = elementSpace.centerX / window.width;
    windowLocation.heightLocat = elementSpace.centerY / window.height;
    return windowLocation;
}

/**
 * 根据传入的direction 进行相应的操作（上滑、下滑、左滑、右滑）
 * @param {*} op 操作的设备
 * @param {} direction 滑动方向字符串，必填项 up｜dowm｜left｜right
 * @param {*} space 滑动动作区域
 */
async function swipeAction(op, direction, space) {
    let selfSpace;
    if (isNaN(space)) {
        selfSpace = await getSpace(op, 'window');
    } else {
        selfSpace = space;
    }
    switch (direction) {
        case 'up':
            {
                await op.commonSwipe({
                    startX: selfSpace.width / 2,
                    startY: (selfSpace.height / 3) * 2,
                    endX: selfSpace.width / 2,
                    endY: selfSpace.height / 3,
                });
            }
            break;
        case 'up':
            {
                await op.commonSwipe({
                    startX: selfSpace.width / 2,
                    startY: (selfSpace.height / 3) * 2,
                    endX: selfSpace.width / 2,
                    endY: selfSpace.height / 3,
                });
            }
            break;
        case 'up':
            {
                await op.commonSwipe({
                    startX: selfSpace.width / 2,
                    startY: (selfSpace.height / 3) * 2,
                    endX: selfSpace.width / 2,
                    endY: selfSpace.height / 3,
                });
            }
            break;
        case 'up':
            {
                await op.commonSwipe({
                    startX: selfSpace.width / 2,
                    startY: (selfSpace.height / 3) * 2,
                    endX: selfSpace.width / 2,
                    endY: selfSpace.height / 3,
                });
            }
            break;
    }
}

/**
 * 获取元素/区域大小
 * @param {*} op 被操作的设备
 * @param {*} desc 描述 unq｜appium｜window
 * @param {*} element 元素实例
 */
async function getSpace(op, desc, element) {
    let space = new Object();
    let size, location;
    switch (desc) {
        case 'unq':
            {
                space.width = element.width;
                space.height = element.height;
                space.leftTopX = element.x;
                space.leftTopY = element.y;
                space.centerX = space.leftTopX + space.width / 2;
                space.centerY = space.leftTopY + space.height / 2;
            }
            break;
        case 'appium':
            {
                size = await element.getSize();
                location = await element.getLocation();
                space.width = size.width;
                space.height = size.height;
                space.leftTopX = location.x;
                space.leftTopY = location.y;
                space.centerX = space.leftTopX + space.width / 2;
                space.centerY = space.leftTopY + space.height / 2;
            }
            break;
        case 'window':
            {
                let window = op.windowSize;
                space.width = window.width;
                space.height = window.height;
                space.leftTopX = 0;
                space.leftTopY = 0;
                space.centerX = space.leftTopX + space.width / 2;
                space.centerY = space.leftTopY + space.height / 2;
            }
            break;
    }
    return space;
}

/**
 * 在指定的范围内随机点击 ： 在指定区域
 * @param {*} op 设备
 * @param {*} space 范围
 */
async function randomTap(op, space) {
    let randomX = Math.round(Math.random() * (space.width - 1));
    let randomY = Math.round(Math.random() * (space.height - 1));
    op.commonTap({
        x: randomX,
        y: randomY,
    });
}

/**
 * 点击/长按元素
 * @param {*} op 被操作的设备
 * @param {*} elementObject element 对象，自定义的selfObj
 * @param {*} duration 点击时长
 */
async function press(op, elementObject, duration = 0) {
    await op.commonTap({
        x: elementObject.space.centerX,
        y: elementObject.space.centerY,
        clickTime: duration * 1000,
    });
}

/**
 * 通过坐标来进行点击
 * @param {*} op 被操作的设备
 * @param {*} x x坐标
 * @param {*} y y坐标
 * @param {*} duration 点击时长
 */
async function pressByCoordinate(op, x, y, duration = 0) {
    await op.commonTap({
        x: x,
        y: y,
        clickTime: duration * 1000,
    });
}

/**
 * 对比元素的text是否与传入的text相等
 * @param {*} op 检查的设备
 * @param {*} elementText 待比较的元素的elementText（通过Appium找到）
 * @param {*} assertText 待比较的字符串
 */
async function assertMsgText(op, elementText, assertText) {
    // let elementText = await element.text();
    if (elementText.replace(/(^\s*)|(\s*$)/g, '') !== assertText) {
        await op.stepTag('双方的信息不一致，发送的信息为：' + assertText + '  获取到的信息为：' + elementText);
    } else {
        await op.stepTag('验证-文本-字符串通过！');
    }
}

/**
 * 以HH:mm AM/PM 的方式获取当前的时间
 * @param {*} isAM 是12进制的还是24进制的
 */
async function getTime(isAM) {
    let now_date = new Date();
    let hour = now_date.getHours();
    let minute = now_date.getMinutes();
    let time_msg = '';
    if (minute < 10) {
        minute = '0' + minute;
    }
    if (!isNaN(isAM)) {
        if (hour <= 12) {
            time_msg = hour + ':' + minute + ' AM';
        } else {
            time_msg = (hour % 12) + ':' + minute + ' PM';
        }
    } else {
        time_msg = hour + ':' + minute;
    }
    return time_msg;
}

/**
 * 获取单个字符串
 * @param {*} start 字符串类型在Unicode上的开始区间
 * @param {*} end 字符串类型在Unicode上的结束区间
 */
async function getChar(start, end) {
    let charNum = Math.round(Math.random() * (unescape(end).charCodeAt() - unescape(start).charCodeAt() - 1)) + unescape(start).charCodeAt();
    let code = charNum.toString(16);
    while (code.length < 4) {
        code = '0' + code;
    }
    return eval("'\\u" + code + "'");
}

/**
 * 获取字符串，用于输入
 * @param {*} strType 字符串类型 目前支持：EN（英文）/ CN（中文）/ number（数字）/ BN（孟加拉语）/ AR（阿拉伯语）/ IN（印地语）/ specialCode（特殊字符）
 * @param {*} strLength 字符串长度 int类型
 */
async function getInputString(strType, strLength) {
    let result = '';
    switch (strType) {
        case 'EN':
            while (result.length < strLength) {
                if (Math.random() <= 0.5) {
                    result = result + (await getChar('\u0041', '\u005A'));
                } else {
                    result = result + (await getChar('\u0061', '\u007A'));
                }
            }
            return result;
        case 'CN':
            while (result.length < strLength) {
                result = result + (await getChar('\u4e00', '\u9fa5'));
            }
            return result;
        case 'number':
            while (result.length < strLength) {
                result = result + (await getChar('\u0030', '\u0039'));
            }
            return result;
        case 'BN':
            while (result.length < strLength) {
                result = result + (await getChar('\u0980', '\u09ff'));
            }
            return result;
        case 'AR':
            while (result.length < strLength) {
                result = result + (await getChar('\u0600', '\u06ff'));
            }
            return result;
        case 'IN':
            while (result.length < strLength) {
                result = result + (await getChar('\u0900', '\u097f'));
            }
            return result;
        case 'specialCode':
            while (result.length < strLength) {
                let randomNum = Math.random();
                if (randomNum < 0.25) {
                    result = result + (await getChar('\u2000', '\u206f'));
                } else if (randomNum < 0.5) {
                    result = result + (await getChar('\u2070', '\u209f'));
                } else if (randomNum < 0.75) {
                    result = result + (await getChar('\u2200', '\u22ff'));
                } else if (randomNum < 1) {
                    result = result + (await getChar('\u25a0', '\u25ff'));
                }
            }
            return result;
    }
    return result;
}

/**
 * 将时间格式的字符串转换成秒数，只支持 HH:mm:ss 以及 mm:ss的格式
 * @param {*} timeStr 需要被转换的格式
 */
async function formatTimeStr(timeStr) {
    let strList = timeStr.split(':');
    let second = 0;
    if (strList.length == 3) {
        second = 3600 * strList[0] + 60 * strList[1] + strList[2];
    } else if (strList.length == 2) {
        second = 60 * strList[0] + strList[1];
    } else {
        second = -1;
    }
    return second;
}

/**
 * 对比时间字段
 * @param {*} op 检查的设备
 * @param {*} elementTime 时间字段的elementTime（通过appium查找到的）
 * @param {*} timeStr 需要对比的字段
 */
async function assertMsgTime(op, elementTime, timeStr) {
    // let elementTime = await element.text();
    let time, hour, minute;
    if (elementTime.indexOf('PM') != -1) {
        time = elementTime.split('PM')[0];
        hour = parseInt(time.split(':')[0]) + 12;
        minute = parseInt(time.split(':')[1]);
        time = hour + ':' + minute;
    } else if (elementTime.indexOf('AM') != -1) {
        time = elementTime.split('AM')[0];
    } else {
        time = elementTime;
    }
    if (time.replace(/(^\s*)|(\s*$)/g, '') !== timeStr.replace(/(^\s*)|(\s*$)/g, '')) {
        await op.stepTag('双方的信息不一致，发送的信息为：' + timeStr + '  获取到的信息为：' + elementTime);
    } else {
        await op.stepTag('验证-时间-字符串通过！');
    }
}

/**
 * 休眠指定时间
 * @param {*} ms 休眠时长，单位：毫秒
 */
async function sleepAction(ms) {
    var start = new Date().getTime();
    //  console.log('休眠前：' + start);
    while (true) {
        if (new Date().getTime() - start > ms) {
            break;
        }
    }
}

module.exports = {
    splitAndGetSearchSpace,
    findAndInitSelfElementObj,
    getWindowLocation,
    swipeAction,
    getSpace,
    randomTap,
    press,
    pressByCoordinate,
    assertMsgText,
    getTime,
    getInputString,
    assertMsgTime,
    sleepAction,
};
