import sys
from PIL import Image
fs=sys.argv[2:]; out=sys.argv[1]
ims=[Image.open(f).resize((540,960)) for f in fs]
s=Image.new('RGB',(540*len(ims)+10*(len(ims)-1),960),'white')
for i,im in enumerate(ims): s.paste(im,(i*550,0))
s.save(out)
