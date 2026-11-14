#!/usr/bin/env python3
"""Original school-life photobook: ISO B5 + 3mm bleed, 300 dpi, all repository photographs."""
import os, re, math, glob, json, random
from pathlib import Path
from PIL import Image, ImageOps, ImageFont, ImageDraw
import img2pdf
import fitz

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "public" / "images"
OUT = ROOT / "book-output"
PAGES = OUT / "_pages"
OUT.mkdir(exist_ok=True)
PAGES.mkdir(exist_ok=True)
DPI = 300
MM = DPI / 25.4
TRIM_W, TRIM_H, BLEED = 176, 250, 3
W, H = round((TRIM_W+2*BLEED)*MM), round((TRIM_H+2*BLEED)*MM)
BX = int(BLEED*MM)
INK = (34, 64, 91)
BLUE = (61, 113, 151)
PALE = (221, 234, 238)
PAPER = (252, 250, 244)
MINT = (219, 230, 207)
SAND = (238, 216, 183)
BORDER = (195, 210, 211)
ASSET = "https://github.com/Laoch832/cloudflare_photoREPO_zrl/tree/main/public/images"
all_images = sorted([p for p in SRC.glob("*.jpeg") if p.is_file()], key=lambda x: x.name.lower())
assert len(all_images) > 100, f"Expected full repository, found {len(all_images)} images"
sans_file = "/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc"
serif_file = "/usr/share/fonts/opentype/noto/NotoSerifCJK-Regular.ttc"
sans_bold_file = "/usr/share/fonts/opentype/noto/NotoSansCJK-Bold.ttc"
for f in (sans_file, serif_file, sans_bold_file):
    assert os.path.exists(f), f"Missing print font: {f}"
cache={}
def font(size, style="sans"):
    k=(size, style)
    if k not in cache:
        cache[k]=ImageFont.truetype({"sans":sans_file,"serif":serif_file,"bold":sans_bold_file}[style],size,index=2)
    return cache[k]

STORIES = [
  ("《开学那天的风》", "校门口的树叶轻轻晃动。有人把书包带往肩上提了提，有人在人群里寻找熟悉的身影。新的学期并没有响亮的开场白，只是在一声“早”里，悄悄开始了。"),
  ("《写在页角的约定》", "笔记本摊开，阳光落在留白处。她在页角写下小小的一行字：别害怕从头开始。后来，这句话没有变成奇迹，却陪着她度过了许多个普通的下午。"),
  ("《操场的风》", "脚步声从跑道那端传来，像一串快而亮的节拍。有人在终点等待，有人在旁边加油。风吹乱头发，也把那个瞬间的笑声送得很远。"),
  ("《课间的十分钟》", "下课铃一响，走廊里就出现了很多故事。一瓶水、半块面包、一句还没讲完的笑话，都能成为快乐的理由。那些小事不起眼，却让校园一天变得完整。"),
  ("《第四排的光》", "窗边的光慢慢移到桌面上，照着翻开的课本和写到一半的题。不是所有问题都能立刻解开。但再认真想一次，答案也许就会靠近一点。"),
  ("《合照之外》", "合照定格的一刻，所有人都朝着镜头看。照片之外，还有队伍排好的几分钟、有人忍不住先笑、有人轻声提醒“看这里”。记忆恰好藏在这些细节里。"),
  ("《雨停后的教学楼》", "雨后的校园有一种安静的明亮。楼梯间的脚步声清楚了，树叶也像刚被擦拭过。她走过熟悉的转角，突然觉得，平凡的日子也可以很值得珍藏。"),
  ("《一场烟花》", "夜空先暗下来，接着亮起细碎的光。人群抬头，笑声在那一瞬间汇到一起。烟花很快散去，却让人记得：有些快乐，短暂也足够明亮。"),
  ("《放学之后》", "教学楼的窗一扇扇暗下去。走出校门时，路灯已亮，晚风带来远处的声音。白天的题目、争论和欢笑都暂时放下，明天还有新的一页。"),
  ("《写给未来的自己》", "若干年后，再打开这一页，会先想起什么？是操场边的风，还是某个认真读书的背影？希望那时的自己仍记得：青春不是一张完美试卷，而是一段真实走过的路。"),
]
UNITS=[
  ("第一单元", "相逢", "走进人群，青春从这里开始", "把普通的一天，读成新故事。"),
  ("第二单元", "奔跑", "操场与远方，都是成长的方向", "有风的地方，总有人认真奔跑。"),
  ("第三单元", "日常", "认真生活，也认真长大", "在细小的日子里，看见明亮。"),
  ("第四单元", "收藏", "留住烟花，也留住每一次回望", "光会散去，记忆仍有颜色。"),
]
HEADINGS=[
 "晨光落进校园","同桌的笑意","走廊里的风","那时的合照","下课铃之后","一次认真凝望",
 "晴天的操场","没有预告的快乐","风吹过跑道","笑声像一束光","关于同行","午后的颜色",
 "那些闪光的日子","记在课本里","比昨天更远","下一页，继续","窗边的座位",
 "认真生活的人","书桌上的光","平凡日子有回声","望向镜头","一张照片的时间",
 "写在青春里","脚步与方向","慢慢长大","愿时光停留","闪亮的片刻","故事仍在继续"]
def group_for(p):
    n=p.name
    if n.startswith(("202411","微信图片","IMG_24")):return 0
    if n.startswith(("202511","dji_fly","IMG_202512")):return 1
    if n.startswith(("202512","IMG_29","IMG_30","_MG_","MEITU_","Screenshot_")):return 2
    return 3

groups=[[] for _ in UNITS]
for p in all_images:groups[group_for(p)].append(p)
assert sum(map(len,groups))==len(all_images)
def chunks(a, n):return [a[i:i+n] for i in range(0,len(a),n)]
def lineno(x):return f"{x:02d}"
def bg():
    page=Image.new("RGB",(W,H),PAPER); d=ImageDraw.Draw(page)
    for i in range(12):
        r=int(W*(i+1)/12)
        c=(252-int(i*.6),251-int(i*.5),246-int(i*.5))
        d.rectangle((0,i*H//12,W,(i+1)*H//12),fill=c)
    # subtle textbook gutter and paper border
    d.line((BX+85, BX+105, W-BX-85, BX+105),fill=(225,229,227),width=2)
    return page,d
def text(d,xy,s,size=48,color=INK,style="sans",anchor=None):
    d.text(xy,s,font=font(size,style),fill=color,anchor=anchor,stroke_width=0)
def wrap(d,txt,f,maxw):
    lines=[];line=""
    for ch in txt:
        if ch=="\n":
            lines.append(line);line="";continue
        if d.textlength(line+ch,font=f)>maxw and line:
            lines.append(line);line=ch
        else:line+=ch
    if line:lines.append(line)
    return lines
def paragraph(d,txt,x,y,w,size=43,gap=1.6,color=INK,style="serif",max_lines=20):
    f=font(size,style)
    lines=wrap(d,txt,f,w)
    for ln in lines[:max_lines]:
        d.text((x,y),ln,font=f,fill=color);y+=int(size*gap)
    return y
def leaves(d,x,y,scale=1.0,flip=1):
    col=[(166,187,139),(195,209,156),(141,174,147),(207,204,148)]
    for i in range(8):
        px=x+flip*(15+i*31)*scale
        py=y+(i%3)*19*scale
        d.line((x,y,px,py), fill=(158,168,140),width=max(2,int(3*scale)))
        r=17*scale
        d.ellipse((px-r,py-r,px+r,py+r),fill=col[i%4])
def header(page,d,unit,title,index,page_no):
    text(d,(195,152),unit,31,BLUE,"bold")
    text(d,(195,208),title,67,INK,"serif")
    d.line((195,318,W-195,318),fill=BLUE,width=3)
    text(d,(W-195,178),f"阅读 · 图像与记忆   /   {index:02d}",28,BLUE,anchor="ra")
    footer(d,page_no)
def footer(d,page_no):
    d.line((195,H-188,W-195,H-188),fill=BORDER,width=2)
    text(d,(200,H-163),"她的校园时光   ·   CAMPUS STORIES",25,BLUE)
    text(d,(W-200,H-165),str(page_no),29,INK,anchor="ra")
def story_box(d,idx,top=2540):
    title,body=STORIES[idx%len(STORIES)]
    d.rounded_rectangle((186,top,W-186,top+286),radius=24,fill=(239,245,243),outline=(217,227,224),width=3)
    text(d,(227,top+23),title,40,BLUE,"bold")
    paragraph(d,body,227,top+92,W-468,size=37,gap=1.5,max_lines=3)
def photo(page,d,path,rect,caption,idx):
    x,y,w,h=map(int,rect)
    d.rounded_rectangle((x+7,y+13,x+w+9,y+h+15),radius=15,fill=(222,226,222))
    d.rounded_rectangle((x,y,x+w,y+h),radius=14,fill=(255,255,254),outline=(204,215,213),width=3)
    img_box=(x+18,y+16,x+w-18,y+h-80)
    iw,ih=(img_box[2]-img_box[0],img_box[3]-img_box[1])
    with Image.open(path) as source:
        im=ImageOps.exif_transpose(source).convert("RGB")
        im.thumbnail((iw,ih),Image.Resampling.LANCZOS)
        px=img_box[0]+(iw-im.width)//2;py=img_box[1]+(ih-im.height)//2
        page.paste(im,(px,py))
    label=f"图 {idx:03d}  ·  {caption}"
    text(d,(x+23,y+h-65),label,29,BLUE)
def gallery(page_num,unit_idx,unit_page,images,first_index):
    page,d=bg()
    unit=UNITS[unit_idx]
    heading=HEADINGS[(page_num-4)%len(HEADINGS)]
    header(page,d,unit[0],heading,unit_page,page_num)
    n=len(images)
    if n==3:
        if unit_page%3==1:
            boxes=[(185,410,W-370,990),(185,1460,852,880),(W-185-852,1460,852,880)]
        elif unit_page%3==2:
            boxes=[(185,410,835,1928),(1077,410,888,925),(1077,1410,888,928)]
        else:
            boxes=[(185,410,W-370,600),(185,1070,W-370,600),(185,1730,W-370,600)]
    elif n==2:
        boxes=[(185,410,W-370,1090),(185,1590,W-370,750)]
    else:
        boxes=[(185,410,W-370,1930)]
    captions=["把瞬间留在纸上","好时光有迹可循","属于我们的这一页"]
    for i,(p,b) in enumerate(zip(images,boxes)):
        photo(page,d,p,b,captions[i%3],first_index+i)
    story_box(d,(page_num+unit_idx*2)%len(STORIES))
    return page
def cover():
    page,d=bg()
    for i in range(0,22):
        cx=120+i*100
        d.ellipse((cx,-50,cx+54,180),fill=(235,242,231))
    leaves(d,200,170,1.5,1)
    text(d,(207,360),"校园记忆 · 原创图文课本",38,BLUE,"bold")
    text(d,(207,520),"她的",134,INK,"serif")
    text(d,(207,682),"校园时光",134,INK,"serif")
    text(d,(212,860),"CAMPUS  STORIES",42,BLUE,"sans")
    text(d,(215,954),"把一段青春，装订成一本书。",44,INK,"serif")
    portrait=next((p for p in all_images if p.name.startswith("MEITU_")),all_images[0])
    photo(page,d,portrait,(190,1180,W-380,1330),"一切故事，从一张照片开始",0)
    d.rounded_rectangle((200,H-344,W-200,H-249),radius=20,fill=BLUE)
    text(d,(W//2,H-320),"摄影图册  ·  校园纪念版",41,(255,255,254),"bold",anchor="mt")
    text(d,(W//2,H-128),"原创设计  /  2026",27,BLUE,anchor="mt")
    return page
def chapter(num,pg):
    page,d=bg()
    unit=UNITS[num]
    d.rectangle((0,0,W,650),fill=(228,238,240))
    leaves(d,220,285,2.5,1)
    leaves(d,W-220,500,2.2,-1)
    text(d,(210,800),unit[0],56,BLUE,"bold")
    text(d,(210,940),unit[1],155,INK,"serif")
    d.line((213,1175,W-210,1175),fill=BLUE,width=7)
    paragraph(d,unit[2],214,1280,W-410,66,1.55,INK,"serif")
    paragraph(d,unit[3],214,1480,W-410,48,1.6,BLUE,"serif")
    # Vector pen-and-school illustration; deliberately not a fabricated portrait.
    base=2320
    d.line((260,base,1880,base),fill=BLUE,width=7)
    d.rectangle((480,1800,1660,base),outline=BLUE,width=9)
    d.polygon([(460,1800),(1070,1560),(1680,1800)],outline=BLUE)
    for x in (620,840,1060,1280,1500):
        for y in (1900,2080):
            d.rectangle((x-48,y-42,x+48,y+75),outline=(125,165,183),width=6)
    d.rectangle((1010,2160,1127,base),outline=BLUE,width=7)
    footer(d,pg)
    return page
def intro(kind,page_no,contents=None):
    page,d=bg()
    if kind=="inside":
        leaves(d,260,325,1.5)
        text(d,(210,700),"在青春的页边，",101,INK,"serif")
        text(d,(210,860),"写下一个小小的永远。",86,INK,"serif")
        paragraph(d,"有些画面会被时间带走，\n有些却会在多年后，\n突然把我们带回熟悉的校园。",225,1180,W-430,56,1.8,BLUE,"serif")
        text(d,(215,H-360),"一本关于光、同学与日常的图册",38,INK)
    elif kind=="preface":
        text(d,(195,385),"写在前面",90,INK,"serif")
        d.line((196,540,W-195,540),fill=BLUE,width=6)
        body="这一册，收藏校园里容易被忽略的瞬间：操场上的风、教室里的灯光、合照前的笑声，以及普通日子里闪闪发亮的人。\n\n照片是真实存在的记录，短篇故事则是为这些画面写下的文学想象。愿每个翻开它的人，都能想起自己走过的一段路。"
        paragraph(d,body,220,680,W-440,51,1.7,INK,"serif")
        text(d,(230,2270),"阅读提示",44,BLUE,"bold")
        paragraph(d,"请从照片中找一个细节，再读一读相邻的文字。你能想起自己的哪一个校园瞬间？",232,2360,W-465,39,1.7)
    elif kind=="toc":
        text(d,(195,365),"目录",98,INK,"serif")
        d.line((195,510,W-195,510),fill=BLUE,width=5)
        for i,(u,start) in enumerate(contents):
            y=705+i*370
            d.rounded_rectangle((195,y, W-195,y+255),radius=20,outline=BORDER,width=4)
            text(d,(240,y+36),f"{i+1:02d}",78,BLUE,"serif")
            text(d,(450,y+36),f"{u[0]}   {u[1]}",61,INK,"bold")
            text(d,(450,y+127),u[2],38,BLUE)
            text(d,(W-275,y+90),str(start),53,INK,anchor="ra")
    footer(d,page_no)
    return page
def simple_page(kind,page_no,sequence):
    page,d=bg()
    title={"reflect":"想一想 · 写在页边","after":"后记 · 致那些日子","credits":"编后 · 关于这本图册","end":"故事，仍在继续"}[kind]
    text(d,(205,370),title,82,INK,"serif")
    d.line((205,550,W-200,550),fill=BLUE,width=5)
    if kind=="reflect":
        prompts=["哪一张照片让你立刻想起某个声音？","如果给那个瞬间写一个题目，你会写什么？","多年以后，你希望记住怎样的自己？"]
        for k,p in enumerate(prompts):
            y=730+k*690
            text(d,(220,y),f"{k+1:02d}   {p}",43,BLUE,"bold")
            for t in range(3):
                yy=y+145+t*110
                d.line((235,yy,W-225,yy),fill=BORDER,width=2)
    elif kind=="after":
        para="走到最后一页，才发现真正值得收藏的从不是某个完美姿势，而是认真生活过的证据。镜头可以把瞬间留住，却无法完全留住风、声音和那时的心情。所以，我们把一些小故事写在照片旁边，让它们有机会继续被想起。\n\n愿她回望这段日子时，先看到自己的光亮，也能温柔地接纳当时的平凡。"
        paragraph(d,para,225,720,W-440,50,1.8,INK,"serif")
    elif kind=="credits":
        para=f"素材来源：{ASSET}\n\n版式：参考2022年后新版语文教材的阅读层级、单元导读、图注及阅读提示，采用原创视觉设计。非人民教育出版社出版物。\n\n故事说明：本册校园小故事为文学创作，不代表照片中真实人物的生活经历、身份或心理状态。\n\n图片处理：遵循原照片构图，仅进行等比缩放、适度裁切和版面适配。印刷尺寸：ISO B5（176 × 250 mm）+ 四边3 mm出血；300 dpi。"
        paragraph(d,para,220,710,W-445,40,1.7,INK)
    else:
        leaves(d,320,1010,2.5)
        text(d,(220,1270),"愿下次翻开时，",83,INK,"serif")
        text(d,(220,1420),"仍记得今天的光。",83,INK,"serif")
    footer(d,page_no)
    return page
def index_page(items,part,pg):
    page,d=bg()
    text(d,(195,332),f"照片索引  {part}/2",78,INK,"serif")
    d.line((196,485,W-195,485),fill=BLUE,width=4)
    rows=math.ceil(len(items)/2)
    for i,(n,pg_num) in enumerate(items):
        col=0 if i<rows else 1
        row=i if col==0 else i-rows
        x=195+col*915;y=565+row*60
        short=n.replace("_compressed.jpeg","").replace(".jpeg","")
        if len(short)>34:short=short[:31]+"…"
        text(d,(x,y),f"{short}",25,INK)
        text(d,(x+842,y),str(pg_num),24,BLUE,anchor="ra")
    footer(d,pg)
    return page

# Build a page plan before rendering to make the table of contents and filenames verifiable.
plan=[("cover",None),("inside",None),("preface",None),("toc",None)]
toc=[];placements=[];photo_no=1
for unit_idx,ph in enumerate(groups):
    toc.append((UNITS[unit_idx],len(plan)+1))
    plan.append(("chapter",unit_idx))
    for pgi,chunk in enumerate(chunks(ph,3),start=1):
        plan.append(("gallery",(unit_idx,pgi,chunk,photo_no)))
        for pp in chunk:
            placements.append((pp.name,len(plan)))
        photo_no+=len(chunk)
# Add useful reflection pages before final back matter, and ensure printer-friendly multiples of four.
closing=5 # afterword, credits, index x2, end
while (len(plan)+closing)%4:
    plan.append(("reflect",None))
plan.extend([("after",None),("credits",None),("index1",None),("index2",None),("end",None)])
# One extra page may be needed to keep cover 1 and back cover multiple-of-4 separately
assert len(plan)%4==0
assert len(placements)==len(all_images)
assert len(set(x for x,_ in placements))==len(all_images)
half=(len(placements)+1)//2
for i,(kind,info) in enumerate(plan):
    page_no=i+1
    if kind=="cover":page=cover()
    elif kind=="chapter":page=chapter(info,page_no)
    elif kind=="gallery":
        u,pg,files,n=info
        page=gallery(page_no,u,pg,files,n)
    elif kind in ("inside","preface"):page=intro(kind,page_no)
    elif kind=="toc":page=intro("toc",page_no,toc)
    elif kind=="index1":page=index_page(placements[:half],1,page_no)
    elif kind=="index2":page=index_page(placements[half:],2,page_no)
    else:page=simple_page(kind,page_no,i)
    outfile=PAGES / f"{i+1:03d}.jpg"
    page.save(outfile,"JPEG",quality=86,subsampling=0,optimize=True,dpi=(DPI,DPI))
    if i in (0,3,5,len(plan)//2,len(plan)-1):
        preview=page.copy()
        preview.thumbnail((650,920),Image.Resampling.LANCZOS)
        preview.save(OUT/f"preview_{i+1:03d}.jpg",quality=86)
    print(f"PAGE {page_no}/{len(plan)} {kind}",flush=True)
rawfile=OUT/"_unboxed.pdf"
pdfpath=OUT/"Campus_Stories_B5_Print_300dpi.pdf"
imgs=sorted(PAGES.glob("*.jpg"))
with open(rawfile,"wb") as dst:
    dst.write(img2pdf.convert([str(p) for p in imgs],layout_fun=img2pdf.get_fixed_dpi_layout_fun((300,300))))
doc=fitz.open(rawfile)
assert len(doc)==len(plan)
margin=3*72/25.4
for p in doc:
    # PDF media & bleed include 3mm beyond final cutting size.
    p.set_trimbox(fitz.Rect(margin,margin,p.rect.width-margin,p.rect.height-margin))
    try:p.set_bleedbox(p.mediabox)
    except Exception:pass
doc.set_metadata({"title":"她的校园时光｜校园纪念图册","author":"原创校园纪念图册","subject":"ISO B5，四边3mm出血，300dpi","keywords":"校园 图册 纪念 人教版风格"})
doc.save(str(pdfpath),garbage=3,deflate=True)
doc.close()
manifest={"photos":len(all_images),"pages":len(plan),"chapter_counts":[len(v) for v in groups],"trim_mm":[TRIM_W,TRIM_H],"bleed_mm":BLEED,"dpi":DPI,"placements":[{"filename":n,"page":p} for n,p in placements]}
(OUT/"photo_manifest.json").write_text(json.dumps(manifest,ensure_ascii=False,indent=2),encoding="utf-8")
print("RESULT",pdfpath,os.stat(pdfpath).st_size,manifest["pages"],manifest["photos"],flush=True)
