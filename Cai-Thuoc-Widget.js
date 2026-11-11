// Widget Cai Thuoc - Scriptable for iPhone
// Created for the cai-thuoc GitHub Pages app. All data remains on your iPhone.
const KEY = "caiThuocWidgetLastV1";
const WEB = "https://vietnamai1905-ops.github.io/Repository-name-cai-thuoc/";
const params = args.queryParameters || {};
const incoming = params.last;
function goodDate(value) {
  const t = Date.parse(value);
  return Number.isFinite(t) && t > 0 && t <= Date.now();
}
if (incoming && goodDate(incoming)) {
  Keychain.set(KEY, new Date(incoming).toISOString());
  if (!config.runsInWidget) {
    const notice = new Alert();
    notice.title = "Da dong bo Widget";
    notice.message = "Da nhan moc KHONG HUT LIEN TUC tu app cai thuoc. Widget se duoc cap nhat theo lich cua iOS.";
    notice.addAction("Xem Widget");
    await notice.present();
  }
}
if (!Keychain.contains(KEY) && !config.runsInWidget) {
  const form = new Alert();
  form.title = "Moc cai thuoc";
  form.message = "Nhap ngay gio DIEU CUOI: YYYY-MM-DD HH:mm (gio tren iPhone). Hoac mo app web va chon Dong bo Widget.";
  const now = new Date();
  const pad = n => String(n).padStart(2,"0");
  form.addTextField("YYYY-MM-DD HH:mm", now.getFullYear()+"-"+pad(now.getMonth()+1)+"-"+pad(now.getDate())+" "+pad(now.getHours())+":"+pad(now.getMinutes()));
  form.addAction("Luu");
  form.addCancelAction("Huy");
  const selected = await form.presentAlert();
  if (selected === 0) {
    const v = form.textFieldValue(0).trim();
    const m = /^(\d{4})-(\d{2})-(\d{2})\s+(\d{2}):(\d{2})$/.exec(v);
    if (!m) throw new Error("Dinh dang: YYYY-MM-DD HH:mm");
    const d = new Date(+m[1], +m[2]-1, +m[3], +m[4], +m[5]);
    if (d.getFullYear() !== +m[1] || d.getMonth() !== +m[2]-1 || d.getDate() !== +m[3] || d.getHours() !== +m[4] || d.getMinutes() !== +m[5] || !goodDate(d.toISOString())) throw new Error("Ngay gio khong hop le");
    Keychain.set(KEY,d.toISOString());
  }
}
const w = new ListWidget();
w.url = WEB;
w.setPadding(15,17,14,17);
const grad = new LinearGradient();
grad.colors=[new Color("#102731"),new Color("#24484b")];
grad.locations=[0,1];
w.backgroundGradient=grad;
const mint = new Color("#a8ecdb"), gold = new Color("#ffda9d"), white = new Color("#fffaf5"), soft = new Color("#d6e7e3");
const top = w.addText("🚭  HANH TRINH CAI THUOC");
top.font=Font.boldSystemFont(11);top.textColor=mint;top.lineLimit=1;top.minimumScaleFactor=.6;
w.addSpacer(10);
if (Keychain.contains(KEY) && goodDate(Keychain.get(KEY))) {
  const start = new Date(Keychain.get(KEY));
  const sec = Math.max(0,Math.floor((Date.now()-start.getTime())/1000));
  const days = Math.floor(sec/86400);
  const hours = Math.floor((sec%86400)/3600);
  const minutes = Math.floor((sec%3600)/60);
  const big=w.addText(days+" NGAY");
  big.font=Font.boldSystemFont(32);big.textColor=gold;big.minimumScaleFactor=.5;big.lineLimit=1;
  w.addSpacer(4);
  const detail=w.addText(hours+" gio  "+minutes+" phut khong hut");
  detail.font=Font.mediumSystemFont(13);detail.textColor=white;detail.lineLimit=1;detail.minimumScaleFactor=.7;
  w.addSpacer();
  const next=w.addText("Moc tiep: "+(days+1)+" ngay");
  next.font=Font.mediumSystemFont(11);next.textColor=mint;
  const bar=w.addStack();bar.size=new Size(0,5); 
  w.refreshAfterDate=new Date(Date.now()+15*60*1000);
} else {
  const message=w.addText("Chua cai dat moc cai thuoc");
  message.font=Font.semiboldSystemFont(17);message.textColor=white;
  w.addSpacer(7);
  const sub=w.addText("Mo Scriptable, chay script 1 lan de nhap moc.");
  sub.font=Font.systemFont(12);sub.textColor=soft;
}
if (config.runsInWidget) {
  Script.setWidget(w);
} else {
  await w.presentSmall();
}
Script.complete();
