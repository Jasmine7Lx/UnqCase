// Requires the admc/wd client library
// (npm install wd)
// Then paste this into a .js file and run with Node 7.6+

module.exports = async function main (operation,directoryPath,directoryName) {
  await operation.init(directoryPath,directoryName);
// laixiaohui于2020.8.26编写完成
//检查是否有邀请好友弹窗
// if(await operation[0].removeBackgroundExist({imgName:'scriptImg_1597888082608'})){
// }
const {
  followPopAction,
  unfollowAction,
  deleteChatAction,
  enterChannelbyLink,
  searchCityAction,
} = require("../../commonMethod/channelAction.js");

const {
  enterTargetChatView,
  sendLinkMsgAction,
} = require("../../commonMethod/chatAssistActions.js");

/** 进入特定用户会话页，先删除相关的记录 */
await enterTargetChatView(operation[0], "13609729257");
await deleteChatAction(operation[0]);

/** ---------------------------------------------------------------------------------------  */
/** --------------------------------------- 服务号关注 ------------------------------------  */
/** ---------------------------------------------------------------------------------------  */
/** 通过链接进入特定服务号 */
let commonChannelLink = "https://channel.imo.im/57532636";
await enterChannelbyLink(operation[0], commonChannelLink);

/** 关注订阅号 */
await operation[0].imgTap({ imgName: "scriptImg_1597398414134" });
await operation[0].imgAssert({
  imgName: "scriptImg_1599127391430",
});
await operation[0].finishedCase("channel_follow_android_001");

/** ---------------------------------------------------------------------------------------  */
/** ---------------------------------------图片卡片------------------------------------  */
/** ---------------------------------------------------------------------------------------  */
while (true) {
  if (await operation[0].imgExist({ imgName: "scriptImg_1599122753393" })) {
    break;
  }
  await operation[0].swipe(527 / 1080, 1580 / 1920, 578 / 1080, 551 / 1920);
}
try {
  let photoImg = await operation[0].driver.element(
    "id",
    "com.imo.android.imoimalpha.Channel:id/riv_img_post"
  );
  await photoImg.click();
  try {
    await operation[0].imgAssert({ imgName: "scriptImg_1599122753393" });
    await operation[0].imgAssert({ imgName: "scriptImg_1599122779619" });
    await operation[0].imgAssert({ imgName: "scriptImg_1599122819130" });

    await operation[0].imgAssert({ imgName: "scriptImg_1599122931749" });

    await operation[0].finishedCase("channel_photo_view_android_001");
  } catch (err) {
    await operation[0].stepTag("图片展示异常");
  }
} catch (err) {
  await operation[0].stepTag("不存在图片卡片");
}

/** ---------------------------------------------------------------------------------------  */
/** --------------------------------------- 图片卡片分享 ------------------------------------  */
/** ---------------------------------------------------------------------------------------  */
/** 分享到单聊/讨论组/大群/story */
await operation[0].imgTap({ imgName: "scriptImg_1599122819130" });
let searchBox = await operation[0].driver.element(
  "id",
  "com.imo.android.imoimalpha:id/search_box"
);
let chooseBox = await operation[0].driver.element(
  "id",
  "com.imo.android.imoimalpha:id/checkbox"
);

/** 1、分享到单聊 */
await searchBox.click();
await operation[0].keys("Imo_Auto_B");
await chooseBox.click();
/** 2、分享到讨论组 */
await searchBox.click();
await operation[0].keys("Invincible_Imo_Auto_Group");
await chooseBox.click();
/** 3、分享到大群 */
await searchBox.click();
await operation[0].keys("Super_Imo_Auto_Biggroup");
await chooseBox.click();
/** 4、分享到story */
let storyEntrance = await operation[0].driver.element(
  "xpath",
  "//*[@resource-id='com.imo.android.imoimalpha:id/toptext'][@text='My Story']"
);
await storyEntrance.click();

await operation[0].imgTap({ imgName: "scriptImg_1598603579123" });

/** 返回到首页 */
await operation[0].back();
await operation[0].back();
await operation[0].back();

/** 进入story检查 */
let mystoryEntrance = await operation[0].driver.element(
  "xpath",
  "//*[@resource-id='com.imo.android.imoimalpha:id/name'][@text='My Story']"
);
await mystoryEntrance.click();
try {
  await operation[0].imgAssert({ imgName: "scriptImg_1599122753393" });
} catch (err) {
  await operation[0].stepTag("图片分享到story失败");
}
await operation[0].finishedCase("channel_photo_share_story_android_001");
await operation[0].imgTap({ imgName: "scriptImg_1599657167481" });
await operation[0].imgTap({ imgName: "scriptImg_1599657179326" });
await operation[0].back();

/** 进入单聊会话页检查 */
await operation[0].imgTap({ imgName: "scriptImg_1593766542666" });
await operation[0].keys("Imo_Auto_B");
let searchChat = await operation[0].driver.element(
  "id",
  "com.imo.android.imoimalpha:id/toptext"
);
await searchChat.click();
try {
  await operation[0].imgAssert({ imgName: "scriptImg_1599644622227" });
} catch (err) {
  await operation[0].stepTag("图片分享到单聊失败");
}
await operation[0].finishedCase("channel_photo_share_singlechat_android_001");
await operation[0].back();

/** 进入讨论组会话页检查 */
await operation[0].imgTap({ imgName: "scriptImg_1593766542666" });
await operation[0].keys("Invincible_Imo_Auto_Group");
searchChat = await operation[0].driver.element(
  "id",
  "com.imo.android.imoimalpha:id/toptext"
);
await searchChat.click();
try {
  await operation[0].imgAssert({ imgName: "scriptImg_1599644622227" });
} catch (err) {
  await operation[0].stepTag("图片分享到讨论组失败");
}
await operation[0].finishedCase("channel_photo_share_groupchat_android_001");
await operation[0].back();

/** 进入大群会话页检查 */
await operation[0].imgTap({ imgName: "scriptImg_1593766542666" });
await operation[0].keys("Super_Imo_Auto_Biggroup");
searchChat = await operation[0].driver.element(
  "id",
  "com.imo.android.imoimalpha:id/toptext"
);
await searchChat.click();
//处理命中表情引导
if (await operation[0].imgExist({ imgName: "scriptImg_1599658120110" })) {
  let chatInput = await operation[0].driver.element(
    "id",
    "com.imo.android.imoimalpha:id/chat_input"
  );
  await chatInput.click();
}
try {
  await operation[0].imgAssert({ imgName: "scriptImg_1599644622227" });
} catch (err) {
  await operation[0].stepTag("图片分享到大群失败");
}
await operation[0].finishedCase("channel_photo_share_biggroupchat_android_001");
await operation[0].back();
await operation[0].back();

/** ---------------------------------------------------------------------------------------  */
/** ---------------------------------------视频卡片------------------------------------  */
/** ---------------------------------------------------------------------------------------  */
await operation[0].imgTap({ imgName: "scriptImg_1593766542666" });
await operation[0].keys("AutoChannel");
let searchChat = await operation[0].driver.element(
  "id",
  "com.imo.android.imoimalpha:id/toptext"
);
await searchChat.click();
while (true) {
  if (await operation[0].imgExist({ imgName: "scriptImg_1598599121968" })) {
    break;
  }
  await operation[0].swipe(527 / 1080, 1580 / 1920, 578 / 1080, 551 / 1920);
}
try {
  let videoImg = await operation[0].driver.element(
    "id",
    "com.imo.android.imoimalpha.Channel:id/bg"
  );
  await videoImg.click();
  try {
    await new Promise((resolve) => setTimeout(resolve, 20000));
    await operation[0].imgAssert({ imgName: "scriptImg_1599124732401" });
    await operation[0].imgAssert({ imgName: "scriptImg_1599122779619" });
    await operation[0].imgAssert({ imgName: "scriptImg_1599122819130" });

    await operation[0].imgAssert({ imgName: "scriptImg_1599122931749" });
    await operation[0].finishedCase("channel_video_view_android_001");
  } catch (err) {
    await operation[0].stepTag("视频展示异常");
  }
} catch (err) {
  await operation[0].stepTag("不存在视频卡片");
}

/** ---------------------------------------------------------------------------------------  */
/** --------------------------------------- 视频卡片分享 ------------------------------------  */
/** ---------------------------------------------------------------------------------------  */
/** 分享到单聊/讨论组/大群/story */
await operation[0].imgTap({ imgName: "scriptImg_1599122819130" });
let searchBox = await operation[0].driver.element(
  "id",
  "com.imo.android.imoimalpha:id/search_box"
);
let chooseBox = await operation[0].driver.element(
  "id",
  "com.imo.android.imoimalpha:id/checkbox"
);

/** 1、分享到单聊 */
await searchBox.click();
await operation[0].keys("Imo_Auto_B");
await chooseBox.click();
/** 2、分享到讨论组 */
await searchBox.click();
await operation[0].keys("Invincible_Imo_Auto_Group");
await chooseBox.click();
/** 3、分享到大群 */
await searchBox.click();
await operation[0].keys("Super_Imo_Auto_Biggroup");
await chooseBox.click();
/** 4、分享到story */
let storyEntrance = await operation[0].driver.element(
  "xpath",
  "//*[@resource-id='com.imo.android.imoimalpha:id/toptext'][@text='My Story']"
);
await storyEntrance.click();

await operation[0].imgTap({ imgName: "scriptImg_1598603579123" });

/** 返回到首页 */
await operation[0].back();
await operation[0].back();
await operation[0].back();

/** 进入story检查 */
let mystoryEntrance = await operation[0].driver.element(
  "xpath",
  "//*[@resource-id='com.imo.android.imoimalpha:id/name'][@text='My Story']"
);
await mystoryEntrance.click();
try {
  await operation[0].imgAssert({ imgName: "scriptImg_1599657131665" });
} catch (err) {
  await operation[0].stepTag("视频分享到story失败");
}
await operation[0].finishedCase("channel_video_share_story_android_001");
await operation[0].imgTap({ imgName: "scriptImg_1599657167481" });
await operation[0].imgTap({ imgName: "scriptImg_1599657179326" });
await operation[0].back();

/** 进入单聊会话页检查 */
await operation[0].imgTap({ imgName: "scriptImg_1593766542666" });
await operation[0].keys("Imo_Auto_B");
let searchChat = await operation[0].driver.element(
  "id",
  "com.imo.android.imoimalpha:id/toptext"
);
await searchChat.click();
try {
  await operation[0].imgAssert({ imgName: "scriptImg_1599657345788" });
} catch (err) {
  await operation[0].stepTag("视频分享到单聊失败");
}
await operation[0].finishedCase("channel_video_share_singlechat_android_001");
await operation[0].back();

/** 进入讨论组会话页检查 */
await operation[0].imgTap({ imgName: "scriptImg_1593766542666" });
await operation[0].keys("Invincible_Imo_Auto_Group");
searchChat = await operation[0].driver.element(
  "id",
  "com.imo.android.imoimalpha:id/toptext"
);
await searchChat.click();
try {
  await operation[0].imgAssert({ imgName: "scriptImg_1599657345788" });
} catch (err) {
  await operation[0].stepTag("视频分享到讨论组失败");
}
await operation[0].finishedCase("channel_video_share_groupchat_android_001");
await operation[0].back();

/** 进入大群会话页检查 */
await operation[0].imgTap({ imgName: "scriptImg_1593766542666" });
await operation[0].keys("Super_Imo_Auto_Biggroup");
let searchChat = await operation[0].driver.element(
  "id",
  "com.imo.android.imoimalpha:id/toptext"
);
await searchChat.click();
//处理命中表情引导
if (await operation[0].imgExist({ imgName: "scriptImg_1599658120110" })) {
  let chatInput = await operation[0].driver.element(
    "id",
    "com.imo.android.imoimalpha:id/chat_input"
  );
  await chatInput.click();
}

try {
  await operation[0].imgAssert({ imgName: "scriptImg_1599657345788" });
} catch (err) {
  await operation[0].stepTag("视频分享到大群失败");
}
await operation[0].finishedCase("channel_video_share_biggroupchat_android_001");
await operation[0].back();
await operation[0].back();

/** ---------------------------------------------------------------------------------------  */
/** ---------------------------------------链接卡片------------------------------------  */
/** ---------------------------------------------------------------------------------------  */
while (true) {
  if (await operation[0].imgExist({ imgName: "scriptImg_1599120997661" })) {
    break;
  }
  await operation[0].swipe(527 / 1080, 1580 / 1920, 578 / 1080, 551 / 1920);
}
try {
  let linkImg = await operation[0].driver.element(
    "id",
    "com.imo.android.imoimalpha.Channel:id/riv_link_img"
  );
  await linkImg.click();
  try {
    await operation[0].imgAssert({ imgName: "scriptImg_1598671121478" });
    await operation[0].imgAssert({ imgName: "scriptImg_1599121461943" });
    await operation[0].imgAssert({ imgName: "scriptImg_1599121538119" });
    await operation[0].finishedCase("channel_link_view_android_001");
  } catch (err) {
    await operation[0].stepTag("链接展示异常");
  }
} catch (err) {
  await operation[0].stepTag("不存在链接卡片");
}

/** ---------------------------------------------------------------------------------------  */
/** --------------------------------------- 链接卡片分享 ------------------------------------  */
/** ---------------------------------------------------------------------------------------  */
/** 分享到单聊/讨论组/大群/story */
await operation[0].imgTap({ imgName: "scriptImg_1599121461943" });
await operation[0].imgTap({ imgName: "scriptImg_1599884095253" });

let searchBox = await operation[0].driver.element(
  "id",
  "com.imo.android.imoimalpha:id/search_box"
);
let chooseBox = await operation[0].driver.element(
  "id",
  "com.imo.android.imoimalpha:id/checkbox"
);

/** 1、分享到单聊 */
await searchBox.click();
await operation[0].keys("Imo_Auto_B");
await chooseBox.click();
/** 2、分享到讨论组 */
await searchBox.click();
await operation[0].keys("Invincible_Imo_Auto_Group");
await chooseBox.click();
/** 3、分享到大群 */
await searchBox.click();
await operation[0].keys("Super_Imo_Auto_Biggroup");
await chooseBox.click();
/** 4、分享到story */
let storyEntrance = await operation[0].driver.element(
  "xpath",
  "//*[@resource-id='com.imo.android.imoimalpha:id/toptext'][@text='My Story']"
);
await storyEntrance.click();

await operation[0].imgTap({ imgName: "scriptImg_1598603579123" });

/** 返回到首页 */
await operation[0].back();
await operation[0].back();
await operation[0].back();

/** 进入story检查 */
let mystoryEntrance = await operation[0].driver.element(
  "xpath",
  "//*[@resource-id='com.imo.android.imoimalpha:id/name'][@text='My Story']"
);
await mystoryEntrance.click();
try {
  await operation[0].imgAssert({ imgName: "scriptImg_1599884401128" });
} catch (err) {
  await operation[0].stepTag("链接分享到story失败");
}
await operation[0].finishedCase("channel_link_share_story_android_001");
await operation[0].imgTap({ imgName: "scriptImg_1599657167481" });
await operation[0].imgTap({ imgName: "scriptImg_1599657179326" });
await operation[0].back();

/** 进入单聊会话页检查 */
await operation[0].imgTap({ imgName: "scriptImg_1593766542666" });
await operation[0].keys("Imo_Auto_B");
let searchChat = await operation[0].driver.element(
  "id",
  "com.imo.android.imoimalpha:id/toptext"
);
await searchChat.click();
try {
  await operation[0].imgAssert({ imgName: "scriptImg_1599884482192" });
} catch (err) {
  await operation[0].stepTag("链接分享到单聊失败");
}
await operation[0].finishedCase("channel_link_share_singlechat_android_001");
await operation[0].back();

/** 进入讨论组会话页检查 */
await operation[0].imgTap({ imgName: "scriptImg_1593766542666" });
await operation[0].keys("Invincible_Imo_Auto_Group");
let searchChat = await operation[0].driver.element(
  "id",
  "com.imo.android.imoimalpha:id/toptext"
);
await searchChat.click();
try {
  await operation[0].imgAssert({ imgName: "scriptImg_1599884482192" });
} catch (err) {
  await operation[0].stepTag("链接分享到讨论组失败");
}
await operation[0].finishedCase("channel_link_share_groupchat_android_001");
await operation[0].back();

/** 进入大群会话页检查 */
await operation[0].imgTap({ imgName: "scriptImg_1593766542666" });
await operation[0].keys("Super_Imo_Auto_Biggroup");
searchChat = await operation[0].driver.element(
  "id",
  "com.imo.android.imoimalpha:id/toptext"
);
await searchChat.click();
//处理命中表情引导
if (await operation[0].imgExist({ imgName: "scriptImg_1599658120110" })) {
  let chatInput = await operation[0].driver.element(
    "id",
    "com.imo.android.imoimalpha:id/chat_input"
  );
  await chatInput.click();
}

try {
  await operation[0].imgAssert({ imgName: "scriptImg_1599884482192" });
} catch (err) {
  await operation[0].stepTag("链接分享到大群失败");
}
await operation[0].finishedCase("channel_link_share_biggroupchat_android_001");
await operation[0].back();
await operation[0].back();

/** ---------------------------------------------------------------------------------------  */
/** ---------------------------------------转载卡片------------------------------------  */
/** ---------------------------------------------------------------------------------------  */
while (true) {
  if (await operation[0].imgExist({ imgName: "scriptImg_1599125654552" })) {
    break;
  }
  await operation[0].swipe(527 / 1080, 1580 / 1920, 578 / 1080, 551 / 1920);
}
try {
  let repostFollow = await operation[0].driver.element(
    "id",
    "com.imo.android.imoimalpha.Channel:id/reproduce_post_follow_text"
  );
  await repostFollow.click();
  await operation[0].imgAssert({
    imgName: "scriptImg_1599127391430",
  });
  await operation[0].finishedCase("channel_repost_follow_android_001");
} catch (err) {
  await operation[0].stepTag("转载卡片未关注成功");
}

/** 进入设置页取关订阅号 */
await operation[0].imgTap({ imgName: "scriptImg_1599127391430" });
await unfollowAction(operation[0]);

await operation[0].imgAssert({ imgName: "scriptImg_1599125654552" });

/** ---------------------------------------------------------------------------------------  */
/** ---------------------------------------账号卡片------------------------------------  */
/** ---------------------------------------------------------------------------------------  */

while (true) {
  if (await operation[0].imgExist({ imgName: "scriptImg_1599128209859" })) {
    break;
  }
  await operation[0].swipe(527 / 1080, 1580 / 1920, 578 / 1080, 551 / 1920);
}
try {
  let accountFollow = await operation[0].driver.element(
    "id",
    "com.imo.android.imoimalpha:id/imkit_channel_profile_text"
  );
  await accountFollow.click();
  await operation[0].imgAssert({
    imgName: "scriptImg_1597395850651",
  });
  await operation[0].finishedCase("channel_account_follow_android_001");
} catch (err) {
  await operation[0].stepTag("账号卡片未关注成功");
}

/** 进入设置页取关订阅号 */
await operation[0].imgTap({ imgName: "scriptImg_1597395850651" });
await unfollowAction(operation[0]);
await operation[0].imgAssert({ imgName: "scriptImg_1599128209859" });

/** ---------------------------------------------------------------------------------------  */
/** --------------------------------------- 服务号取关 ------------------------------------  */
/** ---------------------------------------------------------------------------------------  */
await operation[0].imgTap({ imgName: "scriptImg_1593766542666" });
await operation[0].keys("AutoChannel");
searchChat = await operation[0].driver.element(
  "id",
  "com.imo.android.imoimalpha:id/toptext"
);
await searchChat.click();

/** 进入设置页取关订阅号 */
await operation[0].imgTap({ imgName: "scriptImg_1599127391430" });
await unfollowAction(operation[0]);
await operation[0].removeBackgroundExist({
  imgName: "scriptImg_1597395723143",
});
await operation[0].removeBackgroundTap({ imgName: "scriptImg_1597395723143" });
await operation[0].imgAssert({ imgName: "scriptImg_1597398414134" });
await operation[0].finishedCase("channel_unfollow_android_001");

/** 首次退出关注引导 */
await operation[0].back();
await followPopAction(operation[0], "cancel");

/** 删除聊天记录 */
await deleteChatAction(operation[0]);

/** ---------------------------------------------------------------------------------------  */
/** --------------------------------------- 天气服务号 ------------------------------------  */
/** ---------------------------------------------------------------------------------------  */
/** 进入服务号页面 */
let weatherChannelLink = "https://channel.imo.im/42220108";
await enterChannelbyLink(operation[0], weatherChannelLink);

if (await operation[0].imgExist({ imgName: "scriptImg_1597399803799" })) {
  await operation[0].permissionAllow();
}

/** 切换城市 */
await operation[0].removeBackgroundTap({ imgName: "scriptImg_1597399974048" });

await followPopAction(operation[0], "follow");

await operation[0].removeBackgroundAssert({
  imgName: "scriptImg_1597400059257",
});
await operation[0].finishedCase("channel_weather_follow_android_001");

await searchCityAction(operation[0], "Delhi");

await operation[0].removeBackgroundAssert({
  imgName: "scriptImg_1597400496777",
});
await operation[0].finishedCase("channel_weather_changecity_android_001");

/** 取关，重置状态 */
await operation[0].removeBackgroundTap({ imgName: "scriptImg_1597395850651" });
await unfollowAction(operation[0]);

/** 删除聊天记录，方便下次执行 */
await deleteChatAction(operation[0]);

/** ---------------------------------------------------------------------------------------  */
/** --------------------------------------- 祷告服务号 ------------------------------------  */
/** ---------------------------------------------------------------------------------------  */

/** 进入祷告服务号 */
let prayChannelLink = "https://channel.imo.im/25453873";
await enterChannelbyLink(operation[0], prayChannelLink);

await operation[0].removeBackgroundTap({ imgName: "scriptImg_1597889506328" });
await followPopAction(operation[0], "follow");

await operation[0].removeBackgroundAssert({
  imgName: "scriptImg_1597400059257",
});
await operation[0].finishedCase("channel_pray_follow_android_001");

/** 切换祷告城市 */
await searchCityAction(operation[0], "Delhi");

await operation[0].removeBackgroundAssert({
  imgName: "scriptImg_1597889920679",
});
await operation[0].finishedCase("channel_prayer_changecity_android_001");

/** 执行祷告 */
await operation[0].removeBackgroundTap({ imgName: "scriptImg_1597890185666" });

await followPopAction(operation[0], "follow");

await operation[0].removeBackgroundAssert({
  imgName: "scriptImg_1597890267391",
});
await operation[0].finishedCase("channel_prayer_pray_android_001");

/** 取关，重置未祷告状态 */
await operation[0].removeBackgroundTap({ imgName: "scriptImg_1597891412647" });
await operation[0].removeBackgroundTap({ imgName: "scriptImg_1597395850651" });
await unfollowAction(operation[0]);

  await operation.resultOutput();
}
