// Development-only fictional profiles; never imported into production.
const previewImage = name => new URL(`assets/images/design-${name}.png`,document.baseURI).href;
const categoryNames=[['海鲜水产','Seafood'],['蔬菜水果','Fresh Produce'],['肉禽蛋','Meat & Eggs'],['粮油干货','Grains & Pantry'],['副食调料','Condiments']];
const merchants=[
 ['永记海鲜档','Wing Kee Seafood','新鲜食材 · 丰富选择','Fresh picks · Wide choice','seafood',0,['基围虾 ¥38/斤','花甲 ¥12/斤','鲈鱼 ¥25/条']],
 ['阿萍蔬果档','Ping’s Fresh Produce','多样品类 · 品质生活','Variety · Quality life','vegetables',1,['本地菜心 ¥6/斤','番茄 ¥5/斤','土豆 ¥4/斤']],
 ['华兴肉铺','Wah Hing Butchery','地道风味 · 烟火气息','Local flavors · Market vibes','meat',2,['猪腱肉 ¥22/斤','排骨 ¥35/斤']],
 ['发记海味档','Fat Kee Seafood','虾蟹贝类 · 鲜活好味','Shrimp, crab & shellfish','seafood-2',0,['生蚝 ¥10/只','花蟹 ¥68/斤']],
 ['绿田园蔬果档','Green Farm Veggies','时令根茎 · 丰盛餐桌','Seasonal roots · Full tables','vegetables-2',1,['秋葵 ¥9/斤','玉米 ¥4/条']],
 ['佳佳禽肉档','Kai Kai Poultry','禽肉鲜品 · 家常美味','Fresh poultry · Home taste','meat-2',2,['清远鸡 ¥28/斤','鲜鸭 ¥20/斤']],
];
export const previewData={schemaVersion:'1.0',revision:0,market:{id:'design-preview',name:'蛇口市场'},categories:categoryNames.map(([name,nameEn],i)=>({id:`preview-${i}`,name,nameEn})),stalls:merchants.map(([name,nameEn,intro,introEn,image,category,goods],i)=>({id:`design-${i}`,name,code:'示意',nameEn,intro,introEn,message:'此处用于展示审核发布后的商户寄语。当前内容仅为设计预览。',messageEn:'A sample note shown for design preview only.',goods:goods&&goods.length?goods:[categoryNames[category][0]],categoryId:`preview-${category}`,floorId:'',zoneId:'',photos:[{localUrl:previewImage(image)}],designPreview:true})),floors:[],encyclopedia:[]};
