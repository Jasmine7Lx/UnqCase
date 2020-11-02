// Requires the admc/wd client library
// (npm install wd)
// Then paste this into a .js file and run with Node 7.6+

module.exports = async function main (operation,directoryPath,directoryName) {
  await operation.init(directoryPath,directoryName);
const {
  enterTargetChatView,
  sendLinkMsgAction,
} = require("../../../commonMethod/chatAssistActions.js");

const {
  press,
  findAndInitSelfElementObj,
} = require("../../../commonMethod/baseActions.js");

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
} = require("../../../commonMethod/channelActions.js");

const {
  swipeTimesAction,
  listEnterAction,
  networkCheckAction,
  followListSwipeAction,
  publishAddLocation,
  publishAddTopic,
  publishPostAction,
  postCheckAction,
  postDeleteAction,
} = require("../../../commonMethod/myplanetActions.js");

/** ---------------------------------------------------------------------------------------  */
/** --------------------------------------- myplanet内列表滑动------------------------------------  */
/** ---------------------------------------------------------------------------------------  */
/** 滑动列表--关注流 */
await listEnterAction(operation[0], "friends");
await swipeTimesAction(operation[0], "up", 20);
await operation[0].finishedCase("myplanet_list_friends_swipe_android_001");

// /** 滑动列表--话题详情页 */
// await listEnterAction(operation[0], "topic", "up", 20);
// await operation[0].finishedCase("myplanet_list_topic_swipe_android_001");
// await operation[0].back();

/** 滑动列表--推荐流 */
await listEnterAction(operation[0], "foryou");
await swipeTimesAction(operation[0], "up", 20);
await operation[0].finishedCase("myplanet_list_foryou_swipe_android_001");

/** 滑动列表--通知中心 */
await listEnterAction(operation[0], "notice");
await swipeTimesAction(operation[0], "up", 10);
await operation[0].finishedCase("myplanet_list_notice_swipe_android_001");
await operation[0].driver.back();

/** ---------------------------------------------------------------------------------------  */
/** ---------------------------------------个人页列表滑动------------------------------------  */
/** ---------------------------------------------------------------------------------------  */
/** 进入特定用户会话页，进入profile页 */
await enterTargetChatView(operation[0], "Imo_Auto_B");
await operation[0].removeBackgroundTap({ imgName: "scriptImg_1597394945015" });
await operation[0].imgTap({ imgName: "scriptImg_1597394955549" });

/** 滑动列表--个人页post列表 */
await swipeTimesAction(operation[0], "up", 12);
//判断列表是否网络异常
await networkCheckAction(operation[0]);
await swipeTimesAction(operation[0], "up", 20);
await operation[0].finishedCase(
  "myplanet_list_profile_posts_swipe_android_001"
);

/** 滑动列表--个人页likes列表 */
let likeList = await operation[0].driver.element(
  "xpath",
  "//*[@resource-id='com.imo.android.imoimalpha:id/tv_tab_text'][@text='Likes']"
);
await likeList.click();
await swipeTimesAction(operation[0], "up", 20);
await operation[0].finishedCase(
  "myplanet_list_profile_likes_swipe_android_001"
);
await operation[0].driver.back();
await operation[0].driver.back();

/** 进入联系人tab-关注列表 */
let contactsEntrance = await operation[0].driver.element(
  "xpath",
  "//*[@resource-id='com.imo.android.imoimalpha:id/tv_tab_text'][@text='Contacts']"
);
await contactsEntrance.click();
await operation[0].imgTap({ imgName: "scriptImg_1593397225485" });

/** 滑动列表 -- 关注 */
await followListSwipeAction(operation[0], "following");
await operation[0].finishedCase("myplanet_list_following_swipe_android_001");

/** 滑动列表--粉丝 */
await followListSwipeAction(operation[0], "followers");
await operation[0].finishedCase("myplanet_list_followers_swipe_android_001");

/** 滑动列表 -- 推荐 */
await followListSwipeAction(operation[0], "recommend");
await operation[0].finishedCase("myplanet_list_recommend_swipe_android_001");

//返回上一层
await operation[0].back();

/** ---------------------------------------------------------------------------------------  */
/** --------------------------------------- 发布功能 ------------------------------------  */
/** ---------------------------------------------------------------------------------------  */
/** 检查图片选择器内容 **/
let myplanetEntrance = await operation[0].driver.element(
  "xpath",
  "//*[@resource-id='com.imo.android.imoimalpha:id/tv_tab_text'][@text='MyPlanet']"
);
await myplanetEntrance.click();
await operation[0].imgTap({ imgName: "scriptImg_1598405636657" });
if (await operation[0].imgExist({ imgName: "scriptImg_1599114181526" })) {
  await operation[0].back();
}

await operation[0].imgAssert({ imgName: "scriptImg_1598405789160" });
await operation[0].imgAssert({ imgName: "scriptImg_1598405796627" });
await operation[0].removeBackgroundAssert({
  imgName: "scriptImg_1598405849415",
});
await operation[0].finishedCase("myplanet_publish_uicheck_android_001");

/** ---------------------------------------------------------------------------------------  */
/** --------------------------------------- 发布图片帖子 ------------------------------------  */
/** ---------------------------------------------------------------------------------------  */
/**  发布图片  **/
await publishPostAction(operation[0], "photo", true, true, true, "delhi");

await new Promise((resolve) => setTimeout(resolve, 5000));

//判断是否发送成功
await postCheckAction(operation[0], "scriptImg_1598601570453");
await operation[0].finishedCase("myplanet_publish_photo_android_001");

//删除已发布帖子
await postDeleteAction(operation[0], "scriptImg_1598601570453");
await operation[0].finishedCase("myplanet_publish_delete_android_001");

/** ---------------------------------------------------------------------------------------  */
/** --------------------------------------- 发布视频帖子 ------------------------------------  */
/** ---------------------------------------------------------------------------------------  */
/** 拍摄10s视频 */
await operation[0].imgTap({ imgName: "scriptImg_1598405636657" });
await publishPostAction(operation[0], "video");

await new Promise((resolve) => setTimeout(resolve, 5000));

/** 判断是否发送成功 */
await postCheckAction(operation[0], "scriptImg_1598601570453");
await operation[0].finishedCase("myplanet_publish_video_android_001");

//删除已发布帖子
await postDeleteAction(operation[0], "scriptImg_1598601570453");

/** ---------------------------------------------------------------------------------------  */
/** --------------------------------------- 发布链接帖子 ------------------------------------  */
/** ---------------------------------------------------------------------------------------  */
/** 进入特定用户会话页，先删除相关的记录 */
await enterTargetChatView(operation[0], "Imo_Auto_B");
await deleteChatAction(operation[0]);

/** 从会话发送链接并分享到内容流 */
await sendLinkMsgAction(
  operation[0],
  "https://m.imo.im",
  "scriptImg_1597395723143"
);

/** 复制链接 */
let linkChat = await findAndInitSelfElementObj(
  operation[0],
  "appium|id",
  "com.imo.android.imoimalpha:id/web_preview_title_b"
);
await press(operation[0], linkChat, 3);
await operation[0].imgTap({ imgName: "scriptImg_1598450933414" });

/** 选择分享到myplanet */
await shareStoryAction(operation[0], "myplanet");

/** 返回内容流并检查发送成功 */
await operation[0].back();
await listEnterAction(operation[0], "friends");
await postCheckAction(operation[0], "scriptImg_1598606574767");
await operation[0].finishedCase("myplanet_publish_link_android_001");

//删除已发布帖子
await postDeleteAction(operation[0], "scriptImg_1598606574767");

/** ---------------------------------------------------------------------------------------  */
/** --------------------------------------- 发布图文帖子 ------------------------------------  */
/** ---------------------------------------------------------------------------------------  */
/** 选择text-card*/
await operation[0].imgTap({ imgName: "scriptImg_1598405636657" });
await publishPostAction(operation[0], "textcard");

await new Promise((resolve) => setTimeout(resolve, 5000));

/** 判断是否发送成功 */
await postCheckAction(operation[0], "scriptImg_1598608993640");
await operation[0].finishedCase("myplanet_publish_textcard_android_001");

//删除已发布帖子
await postDeleteAction(operation[0], "scriptImg_1598608993640");

/** ---------------------------------------------------------------------------------------  */
/** --------------------------------------- 链接帖子 ------------------------------------  */
/** ---------------------------------------------------------------------------------------  */
/** 进入Imo_Auto_B资料页 */
await enterTargetChatView(operation[0], "Imo_Auto_B");
await operation[0].removeBackgroundTap({ imgName: "scriptImg_1597394945015" });
await operation[0].imgTap({ imgName: "scriptImg_1597394955549" });

/** 进入详情页--链接帖子 */
let myplanet_link = await operation[0].imgExist({
  imgName: "scriptImg_1598606574767",
});

do {
  await operation[0].swipe(541 / 1080, 1291 / 1920, 534 / 1080, 789 / 1920);
  //判断无网络状态
  let refreshElement = await operation[0].elementExist(
    '{"elementKey":"elementKeyNum_1254","platformName":"Android"}'
  );
  if (refreshElement) {
    let refreshButton = await operation[0].driver.element(
      "id",
      "com.imo.android.imoimalpha:id/topic_empty_refresh"
    );
    await refreshButton.click();
  }
  myplanet_link = await operation[0].imgExist({
    imgName: "scriptImg_1598606574767",
  });
} while (!myplanet_link);

let myplanet_link_position = await operation[0].imgRecognize({
  imgName: "scriptImg_1598606574767",
});
await operation[0].commonTap({
  x: myplanet_link_position.x,
  y: myplanet_link_position.y - 200,
});

/** 打开链接==链接帖子 */
await operation[0].imgTap({ imgName: "scriptImg_1598606574767" });
await operation[0].imgAssert({ imgName: "scriptImg_1598671121478" });
await operation[0].imgTap({ imgName: "scriptImg_1597394602563" });
await operation[0].finishedCase("myplanet_link_view_android_001");

/** 检查详情页内部--帖子 */
let likeButton;
let commentButton;
let repostButton;
let shareButton;

/** 检查是否存在点赞按钮 */
try {
  likeButton = await operation[0].driver.element(
    "id",
    "com.imo.android.imoimalpha:id/ivLike"
  );
} catch (err) {
  await operation[0].stepTag("不存在点赞按钮");
}

/** 检查是否存在点评论按钮 */
try {
  commentButton = await operation[0].driver.element(
    "id",
    "com.imo.android.imoimalpha:id/ivComment"
  );
} catch (err) {
  await operation[0].stepTag("不存在评论按钮");
}

try {
  repostButton = await operation[0].driver.element(
    "id",
    "com.imo.android.imoimalpha:id/ivForward"
  );
} catch (err) {
  await operation[0].stepTag("不存在一键分享按钮");
}

try {
  repostButton = await operation[0].driver.element(
    "id",
    "com.imo.android.imoimalpha:id/ivShare"
  );
} catch (err) {
  await operation[0].stepTag("不存在分享按钮");
}
await operation[0].finishedCase("myplanet_post_detail_uicheck_android_001");

/** 点赞 */
await likeButton.click();
await operation[0].imgAssert({ imgName: "scriptImg_1598674597882" });
await operation[0].finishedCase("myplanet_post_like_android_001");
await likeButton.click(); // 重置点赞状态

/** 一键分享 */
let before_repost_num = "0";
let after_repost_num = "0";
let repost_element;
//获取一键转发前的值
try {
  repost_element = await operation[0].driver.element(
    "id",
    "com.imo.android.imoimalpha:id/tvForward"
  );
  before_repost_num = await repost_element.text();
} catch (err) {
  await operation[0].stepTag("一键转发前不存在元素，设置0");
}

await operation[0].imgTap({ imgName: "scriptImg_1598683291168" });
//出现后停留3s，等待消失
if (await operation[0].imgExist({ imgName: "scriptImg_1599102228307" })) {
  await new Promise((resolve) => setTimeout(resolve, 3000));
}
//命中底部弹窗实验
if (await operation[0].imgExist({ imgName: "scriptImg_1598683542938" })) {
  await operation[0].imgTap({ imgName: "scriptImg_1598693818690" });
  await operation[0].imgTap({ imgName: "scriptImg_1597400447945" });
}

//获取一键分享后的值
try {
  repost_element = await operation[0].driver.element(
    "id",
    "com.imo.android.imoimalpha:id/tvForward"
  );
  after_repost_num = await repost_element.text();
} catch (err) {
  await operation[0].stepTag("一键分享后不存在元素，设置0");
}

//对比点击前后数字是否正常+1
if (parseInt(after_repost_num) != parseInt(before_repost_num) + 1) {
  await operation[0].stepTag("一键分享失败，分享后数字未加1");
}
await operation[0].finishedCase("myplanet_post_repost_android_001");

/** 删除一键分享 */
await operation[0].imgTap({ imgName: "scriptImg_1598683579189" });
await operation[0].imgTap({ imgName: "scriptImg_1598595522057" });
if (parseInt(after_repost_num) != parseInt(before_repost_num) + 1) {
  await operation[0].stepTag("删除不成功");
}

/** 评论 */
await commentButton.click();
await operation[0].keys("auto_reply");
let sendButton = await operation[0].driver.element(
  "id",
  "com.imo.android.imoimalpha:id/send"
);
await sendButton.click();
//检查评论是否成功发送
await new Promise((resolve) => setTimeout(resolve, 2000));

let commentElement = await operation[0].driver.element(
  "xpath",
  "//androidx.recyclerview.widget.RecyclerView[@resource-id='com.imo.android.imoimalpha:id/recycler_view']/android.view.ViewGroup[1]"
);
let comment = await commentElement.element(
  "id",
  "com.imo.android.imoimalpha:id/tv_comment"
);
if ((await comment.text()) != "auto_reply") {
  await operation[0].stepTag("评论失败");
}
await operation[0].finishedCase("myplanet_post_comment_android_001");
//复原定位
await operation[0].swipe(561 / 1080, 391 / 1920, 539 / 1080, 1500 / 1920);

/** ---------------------------------------------------------------------------------------  */
/** --------------------------------------- 分享链接帖子 ------------------------------------  */
/** ---------------------------------------------------------------------------------------  */
/** 分享到单聊/讨论组/大群 */
await operation[0].imgTap({ imgName: "scriptImg_1603188213914" });
let shareChats = new Array(
  "Imo_Auto_B",
  "Invincible_Imo_Auto_Group",
  "Super_Imo_Auto_Biggroup"
);
await shareMoreAction(operation[0], shareChats);

/** 分享到story */
await operation[0].imgTap({ imgName: "scriptImg_1603188213914" });
await shareStoryAction(operation[0], "mystory");

/** 返回到首页 */
await operation[0].back();
await operation[0].back();
await operation[0].back();

/** 进入story检查 */
let linkStoryImg = "scriptImg_1603188745749";
await storyCheckAction(operation[0], linkStoryImg);
await operation[0].finishedCase("myplanet_link_share_story_android_001");

let linkChatImg = "scriptImg_1603188745749";
/** 进入单聊会话页检查 */
await chatCheckAction(operation[0], "Imo_Auto_B", linkChatImg);
await operation[0].finishedCase("myplanet_link_share_singlechat_android_001");
await operation[0].back();

/** 进入讨论组会话页检查 */
await chatCheckAction(operation[0], "Invincible_Imo_Auto_Group", linkChatImg);
await operation[0].finishedCase("myplanet_link_share_groupchat_android_001");
await operation[0].back();

/** 进入大群会话页检查 */
await chatCheckAction(operation[0], "Super_Imo_Auto_Biggroup", linkChatImg);
await operation[0].finishedCase("myplanet_link_share_biggroupchat_android_001");
await operation[0].back();
await operation[0].back();

/** ---------------------------------------------------------------------------------------  */
/** --------------------------------------- 视频帖子 ------------------------------------  */
/** ---------------------------------------------------------------------------------------  */
/** 进入特定用户会话页，进入profile页 */
await enterTargetChatView(operation[0], "Imo_Auto_B");
await operation[0].removeBackgroundTap({ imgName: "scriptImg_1597394945015" });
await operation[0].imgTap({ imgName: "scriptImg_1597394955549" });

/** 寻找--视频帖子 */
let myplanet_video = await operation[0].imgExist({
  imgName: "scriptImg_1598671449930",
});
while (!myplanet_video) {
  await operation[0].swipe(541 / 1080, 1291 / 1920, 534 / 1080, 789 / 1920);
  myplanet_video = await operation[0].imgExist({
    imgName: "scriptImg_1598671449930",
  });
}

/** 全屏播放 -- 视频帖子 */
await operation[0].imgTap({ imgName: "scriptImg_1598671449930" });
await operation[0].imgNotExistAssert({ imgName: "scriptImg_1598683291168" });
await operation[0].removeBackgroundTap({ imgName: "scriptImg_1598672887518" });
await operation[0].finishedCase("myplanet_video_full_screen_play_android_001");

/** 非全屏播放 -- 视频帖子 */
await operation[0].removeBackgroundTap({ imgName: "scriptImg_1598695415917" });
try {
  await operation[0].imgNotExistAssert({ imgName: "scriptImg_1598671449930" });
  await operation[0].stepTag("视频自动播放");
} catch {
  await operation[0].stepTag("视频未自动播放");
}

await operation[0].finishedCase("myplanet_video_play_android_001");

/** ---------------------------------------------------------------------------------------  */
/** --------------------------------------- 分享视频帖子 ------------------------------------  */
/** ---------------------------------------------------------------------------------------  */
/** 分享到单聊/讨论组/大群 */
await operation[0].imgTap({ imgName: "scriptImg_1603188213914" });
shareChats = new Array(
  "Imo_Auto_B",
  "Invincible_Imo_Auto_Group",
  "Super_Imo_Auto_Biggroup"
);
await shareMoreAction(operation[0], shareChats);

/** 分享到story */
await operation[0].imgTap({ imgName: "scriptImg_1603188213914" });
await shareStoryAction(operation[0], "mystory");
await operation[0].back();
await operation[0].back();
await operation[0].back();

/** 进入story检查 */
let videoStoryImg = "scriptImg_1603188745749";
await storyCheckAction(operation[0], videoStoryImg);
await operation[0].finishedCase("myplanet_video_share_story_android_001");

let videoChatImg = "scriptImg_1603199595734";
/** 进入单聊会话页检查 */
await chatCheckAction(operation[0], "Imo_Auto_B", videoChatImg);
await operation[0].finishedCase("myplanet_video_share_singlechat_android_001");
await operation[0].back();

/** 进入讨论组会话页检查 */
await chatCheckAction(operation[0], "Invincible_Imo_Auto_Group", videoChatImg);
await operation[0].finishedCase("myplanet_video_share_groupchat_android_001");
await operation[0].back();

/** 进入大群会话页检查 */
await chatCheckAction(operation[0], "Super_Imo_Auto_Biggroup", videoChatImg);
await operation[0].finishedCase(
  "myplanet_video_share_biggroupchat_android_001"
);
await operation[0].back();
await operation[0].back();

/** ---------------------------------------------------------------------------------------  */
/** --------------------------------------- 图片帖子 ------------------------------------  */
/** ---------------------------------------------------------------------------------------  */
/** 进入特定用户会话页，进入profile页 */
await enterTargetChatView(operation[0], "Imo_Auto_B");
await operation[0].removeBackgroundTap({ imgName: "scriptImg_1597394945015" });
await operation[0].imgTap({ imgName: "scriptImg_1597394955549" });
/** 详情页--图片帖子 */
let myplanet_photo = await operation[0].imgExist({
  imgName: "scriptImg_1598584697339",
});
do {
  await operation[0].swipe(541 / 1080, 1291 / 1920, 534 / 1080, 789 / 1920);
  myplanet_photo = await operation[0].imgExist({
    imgName: "scriptImg_1598584697339",
  });
} while (!myplanet_photo);
/** 打开图片 */
await operation[0].imgTap({ imgName: "scriptImg_1598584697339" });
await operation[0].finishedCase("myplanet_photo_view_android_001");

/** ---------------------------------------------------------------------------------------  */
/** --------------------------------------- 分享图片帖子 ------------------------------------  */
/** ---------------------------------------------------------------------------------------  */
/** 分享到单聊/讨论组/大群 */
await operation[0].imgTap({ imgName: "scriptImg_1603200128685" });
await operation[0].imgTap({ imgName: "scriptImg_1603188213914" });
shareChats = new Array(
  "Imo_Auto_B",
  "Invincible_Imo_Auto_Group",
  "Super_Imo_Auto_Biggroup"
);
await shareMoreAction(operation[0], shareChats);

/** 分享到story */
await operation[0].imgTap({ imgName: "scriptImg_1603200128685" });
await operation[0].imgTap({ imgName: "scriptImg_1603188213914" });
await shareStoryAction(operation[0], "mystory");
await operation[0].back();
await operation[0].back();
await operation[0].back();

/** 进入story检查 */
let photoStoryImg = "scriptImg_1603188745749";
await storyCheckAction(operation[0], photoStoryImg);
await operation[0].finishedCase("myplanet_photo_share_story_android_001");

let photoChatImg = "scriptImg_1603200409827";
/** 进入单聊会话页检查 */
await chatCheckAction(operation[0], "Imo_Auto_B", photoChatImg);
await operation[0].finishedCase("myplanet_photo_share_singlechat_android_001");
await operation[0].back();

/** 进入讨论组会话页检查 */
await chatCheckAction(operation[0], "Invincible_Imo_Auto_Group", photoChatImg);
await operation[0].finishedCase("myplanet_photo_share_groupchat_android_001");
await operation[0].back();

/** 进入大群会话页检查 */
await chatCheckAction(operation[0], "Super_Imo_Auto_Biggroup", photoChatImg);
await operation[0].finishedCase(
  "myplanet_photo_share_biggroupchat_android_001"
);
await operation[0].back();
await operation[0].back();

  await operation.resultOutput();
}
