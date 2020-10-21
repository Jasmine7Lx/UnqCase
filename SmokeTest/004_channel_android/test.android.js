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
  shareMoreAction,
  shareStoryAction,
  findSwiftElementAction,
  storyCheckAction,
  chatCheckAction,
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
/** ---------------------------------------视频卡片------------------------------------  */
/** ---------------------------------------------------------------------------------------  */
let targetVideo = "scriptImg_1598599121968";
await findSwiftElementAction(operation[0], targetVideo);

try {
  let videoImg = await operation[0].driver.element(
    "id",
    "com.imo.android.imoimalpha.Channel:id/bg"
  );
  await videoImg.click();
  try {
    await new Promise((resolve) => setTimeout(resolve, 10000));
    await operation[0].imgAssert({ imgName: "scriptImg_1603166520800" });

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
/** 分享到单聊/讨论组/大群 */
await operation[0].imgTap({ imgName: "scriptImg_1599122819130" });
let shareChats = new Array(
  "Imo_Auto_B",
  "Invincible_Imo_Auto_Group",
  "Super_Imo_Auto_Biggroup"
);
await shareMoreAction(operation[0], shareChats);

/** 分享到story */
await operation[0].imgTap({ imgName: "scriptImg_1599122819130" });
await shareStoryAction(operation[0], "mystory");

/** 返回到首页 */
await operation[0].back();
await operation[0].back();
await operation[0].back();

/** 进入story检查 */
let videoStoryImg = "scriptImg_1599657131665";
await storyCheckAction(operation[0], videoStoryImg);
await operation[0].finishedCase("channel_video_share_story_android_001");

let videoChatImg = "scriptImg_1603166598418";
/** 进入单聊会话页检查 */
await chatCheckAction(operation[0], "Imo_Auto_B", videoChatImg);
await operation[0].finishedCase("channel_video_share_singlechat_android_001");
await operation[0].back();

/** 进入讨论组会话页检查 */
await chatCheckAction(operation[0], "Invincible_Imo_Auto_Group", videoChatImg);
await operation[0].finishedCase("channel_video_share_groupchat_android_001");
await operation[0].back();

/** 进入大群会话页检查 */
await chatCheckAction(operation[0], "Super_Imo_Auto_Biggroup", videoChatImg);
await operation[0].finishedCase("channel_video_share_biggroupchat_android_001");
await operation[0].back();
await operation[0].back();

/** ---------------------------------------------------------------------------------------  */
/** ---------------------------------------图片卡片------------------------------------  */
/** ---------------------------------------------------------------------------------------  */
await enterTargetChatView(operation[0], "AutoChannel");
let targetPhoto = "scriptImg_1599122753393";
await findSwiftElementAction(operation[0], targetPhoto);

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
shareChats = new Array(
  "Imo_Auto_B",
  "Invincible_Imo_Auto_Group",
  "Super_Imo_Auto_Biggroup"
);
await shareMoreAction(operation[0], shareChats);

/** 4、分享到story */
await operation[0].imgTap({ imgName: "scriptImg_1599122819130" });
await shareStoryAction(operation[0], "mystory");

/** 返回到首页 */
await operation[0].back();
await operation[0].back();
await operation[0].back();

/** 进入story检查 */
let photoStoryImg = "scriptImg_1599122753393";
await storyCheckAction(operation[0], photoStoryImg);
await operation[0].finishedCase("channel_photo_share_story_android_001");

let photoChatImg = "scriptImg_1599644622227";
/** 进入单聊会话页检查 */
await chatCheckAction(operation[0], "Imo_Auto_B", photoChatImg);
await operation[0].finishedCase("channel_photo_share_singlechat_android_001");
await operation[0].back();

/** 进入讨论组会话页检查 */
await chatCheckAction(operation[0], "Invincible_Imo_Auto_Group", photoChatImg);
await operation[0].finishedCase("channel_photo_share_groupchat_android_001");
await operation[0].back();

/** 进入大群会话页检查 */
await chatCheckAction(operation[0], "Super_Imo_Auto_Biggroup", photoChatImg);
await operation[0].finishedCase("channel_photo_share_biggroupchat_android_001");
await operation[0].back();
await operation[0].back();

/** ---------------------------------------------------------------------------------------  */
/** ---------------------------------------链接卡片------------------------------------  */
/** ---------------------------------------------------------------------------------------  */
await enterTargetChatView(operation[0], "AutoChannel");
let targetLink = "scriptImg_1599120997661";
await findSwiftElementAction(operation[0], targetLink);

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

shareChats = new Array(
  "Imo_Auto_B",
  "Invincible_Imo_Auto_Group",
  "Super_Imo_Auto_Biggroup"
);
await shareMoreAction(operation[0], shareChats);

/** 4、分享到story */
await operation[0].imgTap({ imgName: "scriptImg_1599121461943" });
await operation[0].imgTap({ imgName: "scriptImg_1599884095253" });
await shareStoryAction(operation[0], "mystory");

/** 返回到首页 */
await operation[0].back();
await operation[0].back();
await operation[0].back();

/** 进入story检查 */
let linkStoryImg = "scriptImg_1599884401128";
await storyCheckAction(operation[0], linkStoryImg);
await operation[0].finishedCase("channel_link_share_story_android_001");

let linkChatImg = "scriptImg_1599884482192";
/** 进入单聊会话页检查 */
await chatCheckAction(operation[0], "Imo_Auto_B", linkChatImg);
await operation[0].finishedCase("channel_link_share_singlechat_android_001");
await operation[0].back();

/** 进入讨论组会话页检查 */
await chatCheckAction(operation[0], "Invincible_Imo_Auto_Group", linkChatImg);
await operation[0].finishedCase("channel_link_share_groupchat_android_001");
await operation[0].back();

/** 进入大群会话页检查 */
await chatCheckAction(operation[0], "Super_Imo_Auto_Biggroup", linkChatImg);
await operation[0].finishedCase("channel_link_share_biggroupchat_android_001");
await operation[0].back();
await operation[0].back();

/** ---------------------------------------------------------------------------------------  */
/** ---------------------------------------转载卡片------------------------------------  */
/** ---------------------------------------------------------------------------------------  */
await enterTargetChatView(operation[0], "AutoChannel");
let targetReshare = "scriptImg_1599125654552";
await findSwiftElementAction(operation[0], targetReshare);

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
let targetAccount = "scriptImg_1599128209859";
await findSwiftElementAction(operation[0], targetAccount);

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
/** ---------------------------------------账号卡片分享------------------------------------  */
/** ---------------------------------------------------------------------------------------  */
await operation[0].imgTap({ imgName: "scriptImg_1603167262406" });
shareChats = new Array(
  "Imo_Auto_B",
  "Invincible_Imo_Auto_Group",
  "Super_Imo_Auto_Biggroup"
);
await shareMoreAction(operation[0], shareChats);

/** 4、分享到story */
await operation[0].imgTap({ imgName: "scriptImg_1603167262406" });
await shareStoryAction(operation[0], "mystory");

/** 返回到首页 */
await operation[0].back();
await operation[0].back();

/** 进入story检查 */
let accountStoryImg = "scriptImg_1603175158158";
await storyCheckAction(operation[0], accountStoryImg);
await operation[0].finishedCase("channel_account_share_story_android_001");

let accountChatImg = "scriptImg_1603175647191";
/** 进入单聊会话页检查 */
await chatCheckAction(operation[0], "Imo_Auto_B", accountChatImg);
await operation[0].finishedCase("channel_account_share_singlechat_android_001");
await operation[0].back();

/** 进入讨论组会话页检查 */
await chatCheckAction(
  operation[0],
  "Invincible_Imo_Auto_Group",
  accountChatImg
);
await operation[0].finishedCase("channel_account_share_groupchat_android_001");
await operation[0].back();

/** 进入大群会话页检查 */
await chatCheckAction(operation[0], "Super_Imo_Auto_Biggroup", accountChatImg);

await operation[0].finishedCase(
  "channel_account_share_biggroupchat_android_001"
);
await operation[0].back();
await operation[0].back();

/** ---------------------------------------------------------------------------------------  */
/** --------------------------------------- 服务号取关 ------------------------------------  */
/** ---------------------------------------------------------------------------------------  */
await enterTargetChatView(operation[0], "AutoChannel");

/** 进入设置页取关订阅号 */
await operation[0].imgTap({ imgName: "scriptImg_1599127391430" });
await unfollowAction(operation[0]);

try {
  await operation[0].imgTap({ imgName: "scriptImg_1603274375577" });
  await operation[0].imgAssert({ imgName: "scriptImg_1597398414134" });
} catch (err) {
  await operation[0].stepTag("取关失败");
}
await operation[0].finishedCase("channel_unfollow_android_001");

/** 首次退出关注引导 */
await operation[0].back();
await followPopAction(operation[0], "cancel");
await operation[0].back();

/** ---------------------------------------------------------------------------------------  */
/** --------------------------------------- 天气服务号 ------------------------------------  */
/** ---------------------------------------------------------------------------------------  */
/** 进入特定用户会话页，先删除相关的记录 */
await enterTargetChatView(operation[0], "13609729257");
await deleteChatAction(operation[0]);

/** 进入天气服务号页面 */
let weatherChannelLink = "https://channel.imo.im/42220108";
await enterChannelbyLink(operation[0], weatherChannelLink);

if (await operation[0].imgExist({ imgName: "scriptImg_1597399803799" })) {
  await operation[0].permissionAllow();
}

/** 关注引导弹窗*/
await operation[0].removeBackgroundTap({ imgName: "scriptImg_1597399974048" });
await followPopAction(operation[0], "follow");
await operation[0].removeBackgroundAssert({
  imgName: "scriptImg_1597400059257",
});
await operation[0].finishedCase("channel_weather_follow_android_001");

/** 切换城市 */
await searchCityAction(operation[0], "Delhi");
await operation[0].removeBackgroundAssert({
  imgName: "scriptImg_1597400496777",
});
await operation[0].finishedCase("channel_weather_changecity_android_001");

/** 分享到单聊/讨论中/大群 **/
await operation[0].imgTap({ imgName: "scriptImg_1603178042528" });
shareChats = new Array(
  "Imo_Auto_B",
  "Invincible_Imo_Auto_Group",
  "Super_Imo_Auto_Biggroup"
);
await shareMoreAction(operation[0], shareChats);

/** 4、分享到story */
await operation[0].imgTap({ imgName: "scriptImg_1603178042528" });
await shareStoryAction(operation[0], "mystory");

/** 取关，重置状态 */
await operation[0].removeBackgroundTap({ imgName: "scriptImg_1597395850651" });
await unfollowAction(operation[0]);
await operation[0].back();

/** 进入story检查 */
let weatherStoryImg = "scriptImg_1597400496777";
await storyCheckAction(operation[0], weatherStoryImg);
await operation[0].finishedCase("channel_weather_share_story_android_001");

let weatherChatImg = "scriptImg_1603178631999";
/** 进入单聊会话页检查 */
await chatCheckAction(operation[0], "Imo_Auto_B", weatherChatImg);
await operation[0].finishedCase("channel_weather_share_singlechat_android_001");
await operation[0].back();

/** 进入讨论组会话页检查 */
await chatCheckAction(
  operation[0],
  "Invincible_Imo_Auto_Group",
  weatherChatImg
);
await operation[0].finishedCase("channel_weather_share_groupchat_android_001");
await operation[0].back();

/** 进入大群会话页检查 */
await chatCheckAction(operation[0], "Super_Imo_Auto_Biggroup", weatherChatImg);
await operation[0].finishedCase(
  "channel_weather_share_biggroupchat_android_001"
);
await operation[0].back();
await operation[0].back();

/** ---------------------------------------------------------------------------------------  */
/** --------------------------------------- 祷告服务号 ------------------------------------  */
/** ---------------------------------------------------------------------------------------  */

/** 进入特定用户会话页，先删除相关的记录 */
await enterTargetChatView(operation[0], "13609729257");
await deleteChatAction(operation[0]);

/** 进入祷告服务号 */
let prayChannelLink = "https://channel.imo.im/25453873";
await enterChannelbyLink(operation[0], prayChannelLink);

/** 关注引导弹窗*/
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

/** 分享到单聊/讨论中/大群 **/
await operation[0].imgTap({ imgName: "scriptImg_1603179542791" });
await new Promise((resolve) => setTimeout(resolve, 3000));
await sleep;
shareChats = new Array(
  "Imo_Auto_B",
  "Invincible_Imo_Auto_Group",
  "Super_Imo_Auto_Biggroup"
);
await shareMoreAction(operation[0], shareChats);

/** 分享到story */
await operation[0].imgTap({ imgName: "scriptImg_1603179542791" });
await new Promise((resolve) => setTimeout(resolve, 3000));
await shareStoryAction(operation[0], "mystory");

await operation[0].back();
/** 取关，重置未祷告状态 */
await operation[0].removeBackgroundTap({ imgName: "scriptImg_1597395850651" });
await unfollowAction(operation[0]);
await operation[0].back();

/** 进入story检查 */
let prayedStoryImg = "scriptImg_1603179984140";
await storyCheckAction(operation[0], prayedStoryImg);
await operation[0].finishedCase("channel_prayed_share_story_android_001");

let prayedChatImg = "scriptImg_1603180226271";
/** 进入单聊会话页检查 */
await chatCheckAction(operation[0], "Imo_Auto_B", prayedChatImg);
await operation[0].finishedCase("channel_prayed_share_singlechat_android_001");
await operation[0].back();

/** 进入讨论组会话页检查 */
await chatCheckAction(operation[0], "Invincible_Imo_Auto_Group", prayedChatImg);
await operation[0].finishedCase("channel_prayed_share_groupchat_android_001");
await operation[0].back();

/** 进入大群会话页检查 */
await chatCheckAction(operation[0], "Super_Imo_Auto_Biggroup", prayedChatImg);
await operation[0].finishedCase(
  "channel_prayed_share_biggroupchat_android_001"
);
await operation[0].back();
await operation[0].back();

  await operation.resultOutput();
}
