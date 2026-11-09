-- Source data: rainworld.miraheze.org Module:Creature/config,
-- Template:Relationship/Sort and Chinese text subpages; pinned in sources/.
-- Unicode bracket pairs: Module:Unicode by User:LtDk, CC-BY-SA 4.0.
-- Local changes: relationships-only data, verified display/page/icon mappings.
-- Creature order, internal names, parents and original tags are retained.
local data = {}
 
-- Content tags are interpreted in order, as Creature.new does upstream.
data.creatures = {
    { name = "Slugcat", display = "蛞蝓猫", page = "蛞蝓猫", icon = "蛞蝓猫" },
    { name = "Slugcat NPC", tag = { 'MSC', 'Spoiler' }, display = "蛞蝓猫NPC", page = "蛞蝓猫NPC" },
    { name = "Slugpup", parent = "Slugcat NPC", tag = { 'MSC', 'Spoiler', 'Pseudo' }, display = "蛞蝓猫幼崽", page = "蛞蝓猫幼崽" },
    { name = "Overseer", display = "监视者", page = "监视者", icon = "监视者" },
    { name = "Yellow Overseer", parent = "Overseer", tag = { 'Pseudo' }, display = "黄监视者", page = "黄监视者" },
    { name = "Blue Overseer", parent = "Overseer", tag = { 'Pseudo' }, display = "蓝监视者", page = "蓝监视者" },
    { name = "Green Overseer", parent = "Overseer", tag = { 'Pseudo' }, display = "绿监视者", page = "绿监视者" },
    { name = "Red Overseer", parent = "Overseer", tag = { 'Pseudo' }, display = "红监视者", page = "红监视者" },
    { name = "Purple Overseer", parent = "Overseer", tag = { 'Pseudo' }, display = "紫监视者", page = "紫监视者" },
    { name = "White Overseer", parent = "Overseer", tag = { 'Pseudo' }, display = "白监视者", page = "白监视者" },
    { name = "Lizard", tag = { 'Abstract' }, display = "蜥蜴", page = "蜥蜴", icon = "蜥蜴" },
    { name = "Green Lizard", parent = "Lizard", display = "绿蜥蜴", page = "绿蜥蜴", icon = "绿蜥蜴" },
    { name = "Pink Lizard", parent = "Lizard", display = "粉蜥蜴", page = "粉蜥蜴", icon = "粉蜥蜴" },
    { name = "Blue Lizard", parent = "Lizard", display = "蓝蜥蜴", page = "蓝蜥蜴", icon = "蓝蜥蜴" },
    { name = "White Lizard", parent = "Lizard", display = "白蜥蜴", page = "白蜥蜴", icon = "白蜥蜴" },
    { name = "Black Lizard", parent = "Lizard", display = "黑蜥蜴", page = "黑蜥蜴", icon = "黑蜥蜴" },
    { name = "Yellow Lizard", parent = "Lizard", display = "金蜥蜴", page = "金蜥蜴", icon = "金蜥蜴" },
    { name = "Caramel Lizard", parent = "Lizard", tag = { 'DLC' }, display = "焦糖蜥蜴", page = "焦糖蜥蜴", icon = "焦糖蜥蜴" },
    { name = "Strawberry Lizard", parent = "Lizard", tag = { 'DLC' }, display = "草莓蜥蜴", page = "草莓蜥蜴", icon = "草莓蜥蜴" },
    { name = "Indigo Lizard", parent = "Lizard", tag = { 'Watcher' }, display = "靛蓝蜥蜴", page = "靛蓝蜥蜴", icon = "靛蓝蜥蜴" },
    { name = "Cyan Lizard", parent = "Lizard", display = "青蜥蜴", page = "青蜥蜴", icon = "青蜥蜴" },
    { name = "Red Lizard", parent = "Lizard", display = "烈焰蜥蜴", page = "烈焰蜥蜴", icon = "烈焰蜥蜴" },
    { name = "Train Lizard", parent = "Lizard", tag = { 'MSC', 'Spoiler' }, display = "火车蜥蜴", page = "火车蜥蜴", icon = "火车蜥蜴" },
    { name = "Basilisk Lizard", parent = "Lizard", tag = { 'Watcher' }, display = "蛇怪蜥蜴", page = "蛇怪蜥蜴", icon = "蛇怪蜥蜴" },
    { name = "Blizzard Lizard", parent = "Lizard", tag = { 'Watcher' }, display = "暴雪蜥蜴", page = "暴雪蜥蜴", icon = "暴雪蜥蜴" },
    { name = "Salamander", parent = "Lizard", display = "蝾螈", page = "蝾螈", icon = "蝾螈" },
    { name = "Eel Lizard", parent = "Lizard", tag = { 'DLC' }, display = "鳗蜥蜴", page = "鳗蜥蜴", icon = "鳗蜥蜴" },
    { name = "Peach Lizard", parent = "Lizard", tag = { 'Watcher' }, display = "桃蜥蜴", page = "桃蜥蜴", icon = "桃蜥蜴" },
    { name = "Batfly", display = "蝠蝇", page = "蝠蝇", icon = "蝠蝇" },
    { name = "White Squidcada", display = "白蝉乌贼", page = "白蝉乌贼" },
    { name = "Black Squidcada", parent = "White Squidcada", display = "黑蝉乌贼", page = "黑蝉乌贼" },
    { name = "Snail", display = "波动龟", page = "波动龟", icon = "波动龟" },
    { name = "Red Leech", display = "红水蛭", page = "红水蛭", icon = "红水蛭" },
    { name = "Sea Leech", parent = "Red Leech", display = "海水蛭", page = "海水蛭", icon = "海水蛭" },
    { name = "Jungle Leech", parent = "Red Leech", tag = { 'DLC' }, display = "丛林水蛭", page = "丛林水蛭", icon = "丛林水蛭" },
    { name = "Pole Plant", parent = "Monster Kelp", display = "拟态草", page = "拟态草", icon = "拟态草" },
    { name = "Monster Kelp", display = "红树", page = "红树", icon = "红树" },
    { name = "Garbage Worm", display = "垃圾虫", page = "垃圾虫", icon = "垃圾虫" },
    { name = "Sand Grub", tag = { 'Watcher' }, display = "沙螬", page = "沙螬" },
    { name = "Sand Worm", parent = "Sand Grub", tag = { 'Watcher' }, display = "沙虫", page = "沙虫", icon = "沙虫" },
    { name = "Barnacle", tag = { 'Watcher' }, display = "藤壶", page = "藤壶", icon = "藤壶" },
    { name = "Scavenger", display = "拾荒者", page = "拾荒者", icon = "拾荒者" },
    { name = "Elite Scavenger", parent = "Scavenger", tag = { 'DLC' }, display = "精英拾荒者", page = "精英拾荒者", icon = "精英拾荒者" },
    { name = "Chieftain Scavenger", parent = "Elite Scavenger", tag = { 'MSC', 'Spoiler', 'Unique' }, display = "拾荒者酋长", page = "拾荒者酋长", icon = "拾荒者酋长" },
    { name = "Scavenger Templar", parent = "Scavenger", tag = { 'Watcher' }, display = "拾荒者圣堂武士", page = "拾荒者圣堂武士", icon = "拾荒者圣堂武士" },
    { name = "Scavenger Disciple", parent = "Scavenger", tag = { 'Watcher' }, display = "拾荒者门徒", page = "拾荒者门徒", icon = "拾荒者门徒" },
    { name = "Vulture Grub", display = "射线虫", page = "射线虫", icon = "射线虫" },
    { name = "Vulture", display = "秃鹫", page = "秃鹫", icon = "秃鹫" },
    { name = "King Vulture", parent = "Vulture", display = "魔王鹫", page = "魔王鹫", icon = "魔王鹫" },
    { name = "Big Moth", tag = { 'Watcher' }, display = "大蛾", page = "大蛾", icon = "大蛾" },
    { name = "Small Moth", parent = "Big Moth", tag = { 'Watcher', 'Spoiler' }, display = "小蛾", page = "小蛾", icon = "小蛾" },
    { name = "Infant Centipede", parent = "Adult Centipede", display = "幼年蜈蚣", page = "幼年蜈蚣", icon = "幼年蜈蚣" },
    { name = "Infant Centiwing", parent = "Infant Centipede", tag = { 'DLC', 'Pseudo' }, display = "幼年飞蜈蚣", page = "幼年飞蜈蚣", icon = "幼年飞蜈蚣" },
    { name = "Adult Centipede", display = "成年蜈蚣", page = "成年蜈蚣" },
    { name = "Youth Centipede", parent = "Adult Centipede", tag = { 'Pseudo' }, display = "中型蜈蚣", page = "中型蜈蚣", icon = "中型蜈蚣" },
    { name = "Mature Centipede", parent = "Adult Centipede", tag = { 'Pseudo' }, display = "大型蜈蚣", page = "大型蜈蚣", icon = "大型蜈蚣" },
    { name = "Overgrown Centipede", parent = "Adult Centipede", tag = { 'Pseudo' }, display = "巨型蜈蚣", page = "巨型蜈蚣", icon = "巨型蜈蚣" },
    { name = "Centiwing", parent = "Adult Centipede", display = "飞蜈蚣", page = "飞蜈蚣", icon = "飞蜈蚣" },
    { name = "Red Centipede", parent = "Adult Centipede", display = "烈焰蜈蚣", page = "烈焰蜈蚣", icon = "烈焰蜈蚣" },
    { name = "Aquapede", parent = "Adult Centipede", tag = { 'DLC' }, display = "水蜈蚣", page = "水蜈蚣", icon = "水蜈蚣" },
    { name = "Grappling Worm", display = "管虫", page = "管虫", icon = "管虫" },
    { name = "Sky Whale", tag = { 'Watcher' }, display = "天空鲸", page = "天空鲸", icon = "天空鲸" },
    { name = "Locust Whale", parent = "Sky Whale", tag = { 'Watcher', 'Pseudo' }, display = "蝗虫鲸", page = "蝗虫鲸", icon = "蝗虫鲸" },
    { name = "Hazer", parent = "Vulture Grub", display = "墨鱼", page = "墨鱼", icon = "墨鱼" },
    { name = "Tardigrade", tag = { 'Watcher' }, display = "水熊虫", page = "水熊虫", icon = "水熊虫" },
    { name = "Lantern Mouse", display = "光鼠", page = "光鼠", icon = "光鼠" },
    { name = "Coalescipede", display = "小蜘蛛", page = "小蜘蛛", icon = "小蜘蛛" },
    { name = "Big Spider", display = "狼蛛", page = "狼蛛", icon = "狼蛛" },
    { name = "Spitter Spider", parent = "Big Spider", display = "烈焰狼蛛", page = "烈焰狼蛛", icon = "烈焰狼蛛" },
    { name = "Mother Spider", parent = "Big Spider", tag = { 'DLC' }, display = "蛛母", page = "蛛母", icon = "蛛母" },
    { name = "Locust", tag = { 'Watcher', 'Fake' }, display = "蝗虫", page = "蝗虫", icon = "蝗虫" },
    { name = "Miros Bird", display = "钢鸟", page = "钢鸟", icon = "钢鸟" },
    { name = "Miros Vulture", tag = { 'DLC' }, display = "钢秃鹫", page = "钢秃鹫", icon = "钢秃鹫" },
    { name = "Loach", tag = { 'Watcher' }, display = "泥鳅", page = "泥鳅", icon = "泥鳅" },
    { name = "Proto Long Legs", tag = { 'Fake' }, display = "贴壁长腿菌", page = "贴壁长腿菌" },
    { name = "Brother Long Legs", parent = "Daddy Long Legs", display = "黄长腿菌", page = "黄长腿菌", icon = "黄长腿菌" },
    { name = "Daddy Long Legs", display = "蓝长腿菌", page = "蓝长腿菌", icon = "蓝长腿菌" },
    { name = "Mother Long Legs", parent = "Daddy Long Legs", tag = { 'DLC' }, display = "紫长腿菌", page = "紫长腿菌", icon = "紫长腿菌" },
    { name = "Hunter Long Legs", parent = "Daddy Long Legs", tag = { 'MSC', 'Spoiler', 'Unique' }, display = "猎手长腿菌", page = "猎手长腿菌", icon = "猎手长腿菌" },
    { name = "Bone Shaker", tag = { 'Watcher', 'Spoiler' }, display = "震骨者", page = "震骨者", icon = "震骨者" },
    { name = "Rot Lizard", parent = "Lizard", tag = { 'Watcher', 'Spoiler', 'Pseudo' }, display = "腐化蜥蜴", page = "腐化蜥蜴" },
    { name = "Green Rot Lizard", parent = "Green Lizard", tag = { 'Watcher', 'Spoiler', 'Pseudo' }, display = "腐化绿蜥蜴", page = "腐化绿蜥蜴" },
    { name = "Pink Rot Lizard", parent = "Pink Lizard", tag = { 'Watcher', 'Spoiler', 'Pseudo' }, display = "腐化粉蜥蜴", page = "腐化粉蜥蜴" },
    { name = "Blue Rot Lizard", parent = "Blue Lizard", tag = { 'Watcher', 'Spoiler', 'Pseudo' }, display = "腐化蓝蜥蜴", page = "腐化蓝蜥蜴" },
    { name = "White Rot Lizard", parent = "White Lizard", tag = { 'Watcher', 'Spoiler', 'Pseudo' }, display = "腐化白蜥蜴", page = "腐化白蜥蜴" },
    { name = "Black Rot Lizard", parent = "Black Lizard", tag = { 'Watcher', 'Spoiler', 'Pseudo' }, display = "腐化黑色蜥蜴", page = "腐化黑色蜥蜴" },
    { name = "Yellow Rot Lizard", parent = "Yellow Lizard", tag = { 'Watcher', 'Spoiler', 'Pseudo' }, display = "腐化金蜥蜴", page = "腐化金蜥蜴" },
    { name = "Caramel Rot Lizard", parent = "Caramel Lizard", tag = { 'Watcher', 'Spoiler', 'Pseudo' }, display = "腐化焦糖蜥蜴", page = "腐化焦糖蜥蜴" },
    { name = "Strawberry Rot Lizard", parent = "Strawberry Lizard", tag = { 'Watcher', 'Spoiler', 'Pseudo' }, display = "腐化草莓蜥蜴", page = "腐化草莓蜥蜴" },
    { name = "Indigo Rot Lizard", parent = "Indigo Lizard", tag = { 'Watcher', 'Spoiler', 'Pseudo' }, display = "腐化靛蓝蜥蜴", page = "腐化靛蓝蜥蜴" },
    { name = "Cyan Rot Lizard", parent = "Cyan Lizard", tag = { 'Watcher', 'Spoiler', 'Pseudo' }, display = "腐化青蜥蜴", page = "腐化青蜥蜴" },
    { name = "Red Rot Lizard", parent = "Red Lizard", tag = { 'Watcher', 'Spoiler', 'Pseudo' }, display = "腐化烈焰蜥蜴", page = "腐化烈焰蜥蜴" },
    { name = "Rot Train Lizard", parent = "Train Lizard", tag = { 'MSC', 'Watcher', 'Spoiler', 'Pseudo' }, display = "腐化火车蜥蜴", page = "腐化火车蜥蜴" },
    { name = "Rot Basilisk Lizard", parent = "Basilisk Lizard", tag = { 'Watcher', 'Spoiler', 'Pseudo' }, display = "腐化蛇怪蜥蜴", page = "腐化蛇怪蜥蜴" },
    { name = "Rot Blizzard Lizard", parent = "Blizzard Lizard", tag = { 'Watcher', 'Spoiler', 'Pseudo' }, display = "腐化暴雪蜥蜴", page = "腐化暴雪蜥蜴" },
    { name = "Rot Salamander", parent = "Salamander", tag = { 'Watcher', 'Spoiler' }, display = "腐化蝾螈", page = "腐化蝾螈" },
    { name = "Rot Eel Lizard", parent = "Eel Lizard", tag = { 'Watcher', 'Spoiler', 'Pseudo' }, display = "腐化鳗蜥蜴", page = "腐化鳗蜥蜴" },
    { name = "Peach Eel Lizard", parent = "Eel Lizard", tag = { 'Watcher', 'Spoiler', 'Pseudo' }, display = "Peach Eel Lizard", page = "Peach Eel Lizard" },
    { name = "Lizard Long Legs", parent = "Lizard", tag = { 'Watcher', 'Spoiler', 'Pseudo' }, display = "蜥蜴长腿菌", page = "蜥蜴长腿菌", icon = "蜥蜴长腿菌" },
    { name = "Green Lizard Long Legs", parent = "Green Lizard", tag = { 'Watcher', 'Spoiler', 'Pseudo' }, display = "绿蜥蜴长腿菌", page = "绿蜥蜴长腿菌" },
    { name = "Pink Lizard Long Legs", parent = "Pink Lizard", tag = { 'Watcher', 'Spoiler', 'Pseudo' }, display = "粉蜥蜴长腿菌", page = "粉蜥蜴长腿菌" },
    { name = "Blue Lizard Long Legs", parent = "Blue Lizard", tag = { 'Watcher', 'Spoiler', 'Pseudo' }, display = "蓝蜥蜴长腿菌", page = "蓝蜥蜴长腿菌" },
    { name = "White Lizard Long Legs", parent = "White Lizard", tag = { 'Watcher', 'Spoiler', 'Pseudo' }, display = "白蜥蜴长腿菌", page = "白蜥蜴长腿菌" },
    { name = "Black Lizard Long Legs", parent = "Black Lizard", tag = { 'Watcher', 'Spoiler', 'Pseudo' }, display = "黑蜥蜴长腿菌", page = "黑蜥蜴长腿菌" },
    { name = "Yellow Lizard Long Legs", parent = "Yellow Lizard", tag = { 'Watcher', 'Spoiler', 'Pseudo' }, display = "金蜥蜴长腿菌", page = "金蜥蜴长腿菌" },
    { name = "Caramel Lizard Long Legs", parent = "Caramel Lizard", tag = { 'Watcher', 'Spoiler', 'Pseudo' }, display = "焦糖蜥蜴长腿菌", page = "焦糖蜥蜴长腿菌" },
    { name = "Strawberry Lizard Long Legs", parent = "Strawberry Lizard", tag = { 'Watcher', 'Spoiler', 'Pseudo' }, display = "草莓蜥蜴长腿菌", page = "草莓蜥蜴长腿菌" },
    { name = "Indigo Lizard Long Legs", parent = "Indigo Lizard", tag = { 'Watcher', 'Spoiler', 'Pseudo' }, display = "靛蓝蜥蜴长腿菌", page = "靛蓝蜥蜴长腿菌" },
    { name = "Cyan Lizard Long Legs", parent = "Cyan Lizard", tag = { 'Watcher', 'Spoiler', 'Pseudo' }, display = "青蜥蜴长腿菌", page = "青蜥蜴长腿菌" },
    { name = "Red Lizard Long Legs", parent = "Red Lizard", tag = { 'Watcher', 'Spoiler', 'Pseudo' }, display = "烈焰蜥蜴长腿菌", page = "烈焰蜥蜴长腿菌" },
    { name = "Train Lizard Long Legs", parent = "Train Lizard", tag = { 'MSC', 'Watcher', 'Spoiler', 'Pseudo' }, display = "火车蜥蜴长腿菌", page = "火车蜥蜴长腿菌" },
    { name = "Basilisk Lizard Long Legs", parent = "Basilisk Lizard", tag = { 'Watcher', 'Spoiler', 'Pseudo' }, display = "蛇怪蜥蜴长腿菌", page = "蛇怪蜥蜴长腿菌" },
    { name = "Blizzard Lizard Long Legs", parent = "Blizzard Lizard", tag = { 'Watcher', 'Spoiler', 'Pseudo' }, display = "暴雪蜥蜴长腿菌", page = "暴雪蜥蜴长腿菌" },
    { name = "Salamander Long Legs", parent = "Salamander", tag = { 'Watcher', 'Spoiler', 'Pseudo' }, display = "蝾螈长腿菌", page = "蝾螈长腿菌" },
    { name = "Eel Lizard Long Legs", parent = "Eel Lizard", tag = { 'Watcher', 'Spoiler', 'Pseudo' }, display = "鳗蜥蜴长腿菌", page = "鳗蜥蜴长腿菌" },
    { name = "Peach Lizard Long Legs", parent = "Eel Lizard", tag = { 'Watcher', 'Spoiler', 'Pseudo' }, display = "桃蜥蜴长腿菌", page = "桃蜥蜴长腿菌" },
    { name = "Rot Behemoth", parent = "Loach", tag = { 'Watcher', 'Spoiler' }, display = "腐化巨兽", page = "腐化巨兽" },
    { name = "Inspector", parent = "Daddy Long Legs", tag = { 'DLC' }, display = "监察者", page = "监察者", icon = "监察者" },
    { name = "Box Worm", tag = { 'Watcher' }, display = "箱虫", page = "箱虫", icon = "箱虫" },
    { name = "Fire Sprite", tag = { 'Watcher' }, display = "火精灵", page = "火精灵", icon = "火精灵" },
    { name = "Rain Deer", display = "雨鹿", page = "雨鹿", icon = "雨鹿" },
    { name = "Worm Grass", tag = { 'Fake' }, display = "舌草", page = "舌草", icon = "舌草" },
    { name = "Eggbug", display = "蛋虫", page = "蛋虫", icon = "蛋虫" },
    { name = "Firebug", tag = { 'MSC', 'Spoiler' }, display = "火虫", page = "火虫", icon = "火虫" },
    { name = "Dropwig", display = "落网虫", page = "落网虫", icon = "落网虫" },
    { name = "Stowaway", tag = { 'DLC' }, display = "偷渡者", page = "偷渡者", icon = "偷渡者" },
    { name = "Infant Noodlefly", parent = "Adult Noodlefly", display = "幼年面条蝇", page = "幼年面条蝇", icon = "幼年面条蝇" },
    { name = "Adult Noodlefly", display = "成年面条蝇", page = "成年面条蝇", icon = "成年面条蝇" },
    { name = "Jetfish", display = "蛙鱼", page = "蛙鱼", icon = "蛙鱼" },
    { name = "Yeek", tag = { 'DLC' }, display = "跃客", page = "跃客", icon = "跃客" },
    { name = "Rat", tag = { 'Watcher', 'Spoiler' }, display = "老鼠", page = "老鼠", icon = "老鼠" },
    { name = "Drill Crab", tag = { 'Watcher' }, display = "钻蟹", page = "钻蟹", icon = "钻蟹" },
    { name = "Tower Crab", parent = "Drill Crab", tag = { 'Watcher' }, display = "塔蟹", page = "塔蟹", icon = "塔蟹" },
    { name = "Leviathan", display = "利维坦", page = "利维坦", icon = "利维坦" },
    { name = "Frog", tag = { 'Watcher' }, display = "青蛙", page = "青蛙", icon = "青蛙" },
    { name = "Jellyfish", tag = { 'Fake' }, display = "水母", page = "水母", icon = "水母" },
    { name = "Giant Jellyfish", tag = { 'DLC' }, display = "巨型水母", page = "巨型水母", icon = "巨型水母" },
    { name = "Angler", tag = { 'Watcher'}, display = "琵琶鱼", page = "琵琶鱼", icon = "琵琶鱼" },
    { name = "Moth Grub", tag = { 'Watcher'}, display = "蛾螬", page = "蛾螬" },
    { name = "Echo", tag = { 'Fake' }, display = "回响", page = "回响", icon = "回响" },
    { name = "Void Spawn", tag = { 'Spoiler', 'Fake' }, display = "虚空游魂", page = "虚空游魂", icon = "虚空游魂" },
    { name = "Guardian", tag = { 'Spoiler' }, display = "守卫", page = "守卫", icon = "守卫" },
    { name = "Void Worm", tag = { 'Spoiler', 'Fake' }, display = "虚空蠕虫", page = "虚空蠕虫" },
    { name = "Ripple Spawn", tag = { 'Watcher', 'Spoiler', 'Fake' }, display = "涟漪游魂", page = "涟漪游魂", icon = "涟漪游魂" },
    { name = "Ripple Jelly", tag = { 'Watcher', 'Spoiler', 'Fake' }, display = "涟漪水母", page = "涟漪水母", icon = "涟漪水母" },
    { name = "Ripple Amoeba", tag = { 'Watcher', 'Spoiler', 'Fake' }, display = "涟漪阿米巴", page = "涟漪阿米巴", icon = "涟漪阿米巴" },
    { name = "Ripple Spider", tag = { 'Watcher', 'Spoiler' }, display = "涟漪蜘蛛", page = "涟漪蜘蛛" },
    { name = "Sentient Rot", tag = { 'Watcher', 'Spoiler', 'Fake' }, display = "觉知腐化物", page = "觉知腐化物", icon = "觉知腐化物" },
    { name = "Rot Worm", tag = { 'Spoiler', 'Fake', 'Unique' }, display = "腐化蠕虫", page = "腐化蠕虫" },
}
 
-- Creature/Sort suffixes, not creature configuration order.
-- Missing numeric keys use captured English source expansions (including
-- Peach Eel Lizard's empty suffix); these do not change with display language.
data.creatureSort = {
    ["Slugcat"] = "0101",
    ["Slugcat NPC"] = "0102",
    ["Slugpup"] = "0103",
    ["Overseer"] = "0200",
    ["Yellow Overseer"] = "0201",
    ["Blue Overseer"] = "0202",
    ["Green Overseer"] = "0203",
    ["Red Overseer"] = "0204",
    ["Purple Overseer"] = "0205",
    ["White Overseer"] = "0206",
    ["Lizard"] = "0300",
    ["Green Lizard"] = "0301",
    ["Pink Lizard"] = "0302",
    ["Blue Lizard"] = "0303",
    ["White Lizard"] = "0304",
    ["Black Lizard"] = "0305",
    ["Yellow Lizard"] = "0306",
    ["Caramel Lizard"] = "0307",
    ["Strawberry Lizard"] = "0308",
    ["Indigo Lizard"] = "0309",
    ["Cyan Lizard"] = "0310",
    ["Red Lizard"] = "0311",
    ["Train Lizard"] = "0312",
    ["Basilisk Lizard"] = "0313",
    ["Blizzard Lizard"] = "0314",
    ["Salamander"] = "0315",
    ["Eel Lizard"] = "0316",
    ["Peach Lizard"] = "Peach Lizard",
    ["Batfly"] = "0400",
    ["White Squidcada"] = "0501",
    ["Black Squidcada"] = "0502",
    ["Snail"] = "0600",
    ["Red Leech"] = "0701",
    ["Sea Leech"] = "0702",
    ["Jungle Leech"] = "0703",
    ["Pole Plant"] = "0800",
    ["Monster Kelp"] = "0801",
    ["Garbage Worm"] = "0900",
    ["Sand Grub"] = "0901",
    ["Sand Worm"] = "0902",
    ["Barnacle"] = "0903",
    ["Scavenger"] = "1001",
    ["Elite Scavenger"] = "1002",
    ["Chieftain Scavenger"] = "1003",
    ["Scavenger Templar"] = "1005",
    ["Scavenger Disciple"] = "1006",
    ["Vulture Grub"] = "1101",
    ["Vulture"] = "1102",
    ["King Vulture"] = "1103",
    ["Big Moth"] = "1104",
    ["Small Moth"] = "1105",
    ["Infant Centipede"] = "1201",
    ["Infant Centiwing"] = "1202",
    ["Adult Centipede"] = "1203",
    ["Youth Centipede"] = "1204",
    ["Mature Centipede"] = "1205",
    ["Overgrown Centipede"] = "1206",
    ["Centiwing"] = "1208",
    ["Red Centipede"] = "1207",
    ["Aquapede"] = "1209",
    ["Grappling Worm"] = "1300",
    ["Sky Whale"] = "1301",
    ["Locust Whale"] = "Locust Whale",
    ["Hazer"] = "1400",
    ["Tardigrade"] = "1401",
    ["Lantern Mouse"] = "1500",
    ["Coalescipede"] = "1601",
    ["Big Spider"] = "1701",
    ["Spitter Spider"] = "1702",
    ["Mother Spider"] = "1703",
    ["Locust"] = "1799",
    ["Miros Bird"] = "1800",
    ["Miros Vulture"] = "1801",
    ["Loach"] = "1802",
    ["Proto Long Legs"] = "1901",
    ["Brother Long Legs"] = "1902",
    ["Daddy Long Legs"] = "1903",
    ["Mother Long Legs"] = "1904",
    ["Hunter Long Legs"] = "1905",
    ["Bone Shaker"] = "1906",
    ["Rot Lizard"] = "1907",
    ["Green Rot Lizard"] = "1908",
    ["Pink Rot Lizard"] = "1909",
    ["Blue Rot Lizard"] = "1910",
    ["White Rot Lizard"] = "1911",
    ["Black Rot Lizard"] = "1912",
    ["Yellow Rot Lizard"] = "1913",
    ["Caramel Rot Lizard"] = "1914",
    ["Strawberry Rot Lizard"] = "1915",
    ["Indigo Rot Lizard"] = "1916",
    ["Cyan Rot Lizard"] = "1917",
    ["Red Rot Lizard"] = "1918",
    ["Rot Train Lizard"] = "1919",
    ["Rot Basilisk Lizard"] = "1920-",
    ["Rot Blizzard Lizard"] = "1921",
    ["Rot Salamander"] = "1922",
    ["Rot Eel Lizard"] = "1923",
    ["Peach Eel Lizard"] = "",
    ["Lizard Long Legs"] = "1924",
    ["Green Lizard Long Legs"] = "1925",
    ["Pink Lizard Long Legs"] = "1926",
    ["Blue Lizard Long Legs"] = "1927",
    ["White Lizard Long Legs"] = "1928",
    ["Black Lizard Long Legs"] = "1929",
    ["Yellow Lizard Long Legs"] = "1930",
    ["Caramel Lizard Long Legs"] = "1931",
    ["Strawberry Lizard Long Legs"] = "1932",
    ["Indigo Lizard Long Legs"] = "1933",
    ["Cyan Lizard Long Legs"] = "1934",
    ["Red Lizard Long Legs"] = "1935",
    ["Train Lizard Long Legs"] = "1936",
    ["Basilisk Lizard Long Legs"] = "1937",
    ["Blizzard Lizard Long Legs"] = "1938",
    ["Salamander Long Legs"] = "1939",
    ["Eel Lizard Long Legs"] = "1940",
    ["Peach Lizard Long Legs"] = "Peach Lizard Long Legs",
    ["Rot Behemoth"] = "Rot Behemoth",
    ["Inspector"] = "2000",
    ["Box Worm"] = "2001",
    ["Fire Sprite"] = "2002",
    ["Rain Deer"] = "2003",
    ["Worm Grass"] = "2004",
    ["Eggbug"] = "2100",
    ["Firebug"] = "2101",
    ["Dropwig"] = "2200",
    ["Stowaway"] = "2300",
    ["Infant Noodlefly"] = "2401",
    ["Adult Noodlefly"] = "2402",
    ["Jetfish"] = "2500",
    ["Yeek"] = "2600",
    ["Rat"] = "2601",
    ["Drill Crab"] = "2699",
    ["Tower Crab"] = "Tower Crab",
    ["Leviathan"] = "2700",
    ["Frog"] = "2799",
    ["Jellyfish"] = "2800",
    ["Giant Jellyfish"] = "2801",
    ["Angler"] = "Angler",
    ["Moth Grub"] = "Moth Grub",
    ["Echo"] = "2900",
    ["Void Spawn"] = "2901",
    ["Guardian"] = "2902",
    ["Void Worm"] = "2903",
    ["Ripple Spawn"] = "3000",
    ["Ripple Jelly"] = "3001",
    ["Ripple Amoeba"] = "3002",
    ["Ripple Spider"] = "Ripple Spider",
    ["Sentient Rot"] = "3100",
    ["Rot Worm"] = "3101",
}
 
-- Ordered by the numeric ranks in Template:Relationship/Sort.
data.relations = {
    { key = "Ignores", display = "忽视" },
    { key = "DoesntTrack", display = "不追踪" },
    { key = "Eats", display = "捕食" },
    { key = "Afraid", display = "惧怕" },
    { key = "StayOutOfWay", display = "远离" },
    { key = "AgressiveRival", display = "领地相争" },
    { key = "Attacks", display = "攻击" },
    { key = "Uncomfortable", display = "不适" },
    { key = "Antagonizes", display = "对抗" },
    { key = "PlaysWith", display = "玩伴" },
    { key = "SocialDependent", display = "依好感度而定" },
    { key = "Pack", display = "队友" },
}
 
-- The default parser and creature-list parser use the same bracket pairs.
data.openBrackets = {
    [0x0028] = 0x0029, -- LEFT PARENTHESIS
    [0x005B] = 0x005D, -- LEFT SQUARE BRACKET
    [0x007B] = 0x007D, -- LEFT CURLY BRACKET
    [0x0F3A] = 0x0F3B, -- TIBETAN MARK GUG RTAGS GYON
    [0x0F3C] = 0x0F3D, -- TIBETAN MARK ANG KHANG GYON
    [0x169B] = 0x169C, -- OGHAM FEATHER MARK
    [0x2045] = 0x2046, -- LEFT SQUARE BRACKET WITH QUILL
    [0x207D] = 0x207E, -- SUPERSCRIPT LEFT PARENTHESIS
    [0x208D] = 0x208E, -- SUBSCRIPT LEFT PARENTHESIS
    [0x2308] = 0x2309, -- LEFT CEILING
    [0x230A] = 0x230B, -- LEFT FLOOR
    [0x2329] = 0x232A, -- LEFT-POINTING ANGLE BRACKET
    [0x2768] = 0x2769, -- MEDIUM LEFT PARENTHESIS ORNAMENT
    [0x276A] = 0x276B, -- MEDIUM FLATTENED LEFT PARENTHESIS ORNAMENT
    [0x276C] = 0x276D, -- MEDIUM LEFT-POINTING ANGLE BRACKET ORNAMENT
    [0x276E] = 0x276F, -- HEAVY LEFT-POINTING ANGLE QUOTATION MARK ORNAMENT
    [0x2770] = 0x2771, -- HEAVY LEFT-POINTING ANGLE BRACKET ORNAMENT
    [0x2772] = 0x2773, -- LIGHT LEFT TORTOISE SHELL BRACKET ORNAMENT
    [0x2774] = 0x2775, -- MEDIUM LEFT CURLY BRACKET ORNAMENT
    [0x27C5] = 0x27C6, -- LEFT S-SHAPED BAG DELIMITER
    [0x27E6] = 0x27E7, -- MATHEMATICAL LEFT WHITE SQUARE BRACKET
    [0x27E8] = 0x27E9, -- MATHEMATICAL LEFT ANGLE BRACKET
    [0x27EA] = 0x27EB, -- MATHEMATICAL LEFT DOUBLE ANGLE BRACKET
    [0x27EC] = 0x27ED, -- MATHEMATICAL LEFT WHITE TORTOISE SHELL BRACKET
    [0x27EE] = 0x27EF, -- MATHEMATICAL LEFT FLATTENED PARENTHESIS
    [0x2983] = 0x2984, -- LEFT WHITE CURLY BRACKET
    [0x2985] = 0x2986, -- LEFT WHITE PARENTHESIS
    [0x2987] = 0x2988, -- Z NOTATION LEFT IMAGE BRACKET
    [0x2989] = 0x298A, -- Z NOTATION LEFT BINDING BRACKET
    [0x298B] = 0x298C, -- LEFT SQUARE BRACKET WITH UNDERBAR
    [0x298D] = 0x2990, -- LEFT SQUARE BRACKET WITH TICK IN TOP CORNER
    [0x298F] = 0x298E, -- LEFT SQUARE BRACKET WITH TICK IN BOTTOM CORNER
    [0x2991] = 0x2992, -- LEFT ANGLE BRACKET WITH DOT
    [0x2993] = 0x2994, -- LEFT ARC LESS-THAN BRACKET
    [0x2995] = 0x2996, -- DOUBLE LEFT ARC GREATER-THAN BRACKET
    [0x2997] = 0x2998, -- LEFT BLACK TORTOISE SHELL BRACKET
    [0x29D8] = 0x29D9, -- LEFT WIGGLY FENCE
    [0x29DA] = 0x29DB, -- LEFT DOUBLE WIGGLY FENCE
    [0x29FC] = 0x29FD, -- LEFT-POINTING CURVED ANGLE BRACKET
    [0x2E22] = 0x2E23, -- TOP LEFT HALF BRACKET
    [0x2E24] = 0x2E25, -- BOTTOM LEFT HALF BRACKET
    [0x2E26] = 0x2E27, -- LEFT SIDEWAYS U BRACKET
    [0x2E28] = 0x2E29, -- LEFT DOUBLE PARENTHESIS
    [0x2E55] = 0x2E56, -- LEFT SQUARE BRACKET WITH STROKE
    [0x2E57] = 0x2E58, -- LEFT SQUARE BRACKET WITH DOUBLE STROKE
    [0x2E59] = 0x2E5A, -- TOP HALF LEFT PARENTHESIS
    [0x2E5B] = 0x2E5C, -- BOTTOM HALF LEFT PARENTHESIS
    [0x3008] = 0x3009, -- LEFT ANGLE BRACKET
    [0x300A] = 0x300B, -- LEFT DOUBLE ANGLE BRACKET
    [0x300C] = 0x300D, -- LEFT CORNER BRACKET
    [0x300E] = 0x300F, -- LEFT WHITE CORNER BRACKET
    [0x3010] = 0x3011, -- LEFT BLACK LENTICULAR BRACKET
    [0x3014] = 0x3015, -- LEFT TORTOISE SHELL BRACKET
    [0x3016] = 0x3017, -- LEFT WHITE LENTICULAR BRACKET
    [0x3018] = 0x3019, -- LEFT WHITE TORTOISE SHELL BRACKET
    [0x301A] = 0x301B, -- LEFT WHITE SQUARE BRACKET
    [0xFE59] = 0xFE5A, -- SMALL LEFT PARENTHESIS
    [0xFE5B] = 0xFE5C, -- SMALL LEFT CURLY BRACKET
    [0xFE5D] = 0xFE5E, -- SMALL LEFT TORTOISE SHELL BRACKET
    [0xFF08] = 0xFF09, -- FULLWIDTH LEFT PARENTHESIS
    [0xFF3B] = 0xFF3D, -- FULLWIDTH LEFT SQUARE BRACKET
    [0xFF5B] = 0xFF5D, -- FULLWIDTH LEFT CURLY BRACKET
    [0xFF5F] = 0xFF60, -- FULLWIDTH LEFT WHITE PARENTHESIS
    [0xFF62] = 0xFF63, -- HALFWIDTH LEFT CORNER BRACKET
}
 
return data