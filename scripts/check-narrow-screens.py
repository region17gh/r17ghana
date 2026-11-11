"""Narrow-phone layout check. Run with the dev server up: python3 scripts/check-narrow-screens.py
Fails if any page is wider than the screen, or any element sticks out past the screen edge
(ignoring content inside an intentional sideways scroller or a clipped strip)."""
import asyncio, sys
from playwright.async_api import async_playwright
BASE = sys.argv[1] if len(sys.argv) > 1 else "http://localhost:8080"
PAGES = ["/", "/program", "/invest", "/join", "/live"]
WIDTHS = [320, 360, 375, 390]
JS = """()=>{const w=document.documentElement.clientWidth;const out=[];
for(const e of document.querySelectorAll('body *')){const r=e.getBoundingClientRect();if(!r.width||r.right<=w+1&&r.left>=-1)continue;
let p=e.parentElement,ok=false;while(p&&p!==document.body){const s=getComputedStyle(p);if(s.overflowX!=='visible'){ok=true;break}p=p.parentElement}
if(!ok)out.push(e.tagName.toLowerCase()+'.'+String(e.className).split(' ')[0]+' right='+Math.round(r.right))}
return {sw:document.documentElement.scrollWidth,w,out:out.slice(0,8)}}"""
async def main():
  bad=0
  async with async_playwright() as p:
    b=await p.chromium.launch(headless=True)
    for w in WIDTHS:
      ctx=await b.new_context(viewport={"width":w,"height":740},is_mobile=True,has_touch=True)
      pg=await ctx.new_page()
      for u in PAGES:
        await pg.goto(BASE+u); await pg.wait_for_timeout(1500)
        await pg.add_style_tag(content="html,body{overflow-x:visible!important}")
        r=await pg.evaluate(JS)
        if r["out"] or r["sw"]>r["w"]: bad+=1; print("FAIL",w,u,r)
      await ctx.close()
    await b.close()
  print("narrow screens:", "all clear" if not bad else f"{bad} problems"); sys.exit(1 if bad else 0)
asyncio.run(main())
