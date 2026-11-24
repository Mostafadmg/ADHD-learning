import sys; sys.path.insert(0,'/home/user/ADHD-learning/hairloss-research/companies/philip-kingsley/scratch')
from mk import *
FILL=lambda q,v: {"do":"fill","selector":"#"+q,"value":v}
PC='People close to me can notice it'
def pic(name, q3a, fq):
    d=variant('women',[('q3a',q3a)])
    st=d['steps']; i=qi(st,'q3c'); st[i]=sel(fq,PC); return d
write('w01-q1-pregnant', variant('women',[('q1','Yes')]))
write('w02-q2-chemo', variant('women',[('q2','Yes')]))
write('w03-q3a-overall', pic('w03','Overall thinning','q3b'))
write('w04-q3a-shedding', pic('w04','More shedding than usual (in the shower/on my brush)','q3e'))
write('w06-q3a-patches', pic('w06','Circular bald patches','q3f'))
write('w09-q4-sudden', variant('women',[('q4',"It's happened very suddenly")]))
d=pic('w10','Overall thinning','q3b'); st=d['steps']; st[qi(st,'q4')]=sel('q4',"It's happened very suddenly"); write('w10-q3a-overall-q4-sudden', d)
write('w11-q5a-itching-mild', variant('women',[('q5a','Itching')],{'q5a':[sel('q5f','Mild')]}))
write('w14-q5a-psoriasis', variant('women',[('q5a','Psoriasis')]))
write('w17-q10a-menopause-hrt', variant('women',[('q10a','Yes')],{'q10a':[sel('q10b','Yes')]}))
write('w18-q11a-minoxidil', variant('women',[('q11a','Minoxidil')]))
write('w19-q12a-oral-minoxidil', variant('women',[('q12a','I am taking oral minoxidil')]))
d=variant('scalp',[('q1','Yes')]); st=d['steps']; i=qi(st,'q1'); st.insert(i+1, sel('q2','Seborrhoeic Dermatitis')); write('s01-q1-diagnosed-sebderm', d)
