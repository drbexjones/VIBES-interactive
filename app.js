'use strict';
const responseLabels = [
  {value:'met',label:'Met'},
  {value:'not-met',label:'Not met'},
  {value:'unclear',label:'Unclear'},
  {value:'na',label:'N/A'}
];
const responses = {};
let checklist;
const el = (tag, className, text) => {
  const n=document.createElement(tag);
  if(className) n.className=className;
  if(text!==undefined) n.textContent=text;
  return n;
};
function build() {
  const nav=document.getElementById('domain-nav');
  const list=document.getElementById('domain-list');
  for(const domain of checklist.domains) {
    const domainItems=checklist.items.filter(i=>i.domain===domain.letter);
    const link=el('a','',domain.letter+' · '+domain.name);
    link.href='#domain-'+domain.letter;
    nav.append(link);
    const section=el('section','domain-section');
    section.id='domain-'+domain.letter;
    const head=el('div','domain-heading');
    head.append(el('div','domain-letter',domain.letter));
    const heading=el('div');
    heading.append(el('h3','',domain.name),el('p','',domain.description));
    head.append(heading);
    section.append(head);
    const container=el('div','domain-items');
    for(const item of domainItems) {
      const card=el('article','item');
      const top=el('div','item-top');
      top.append(el('div','item-id',item.id));
      const body=el('div','item-body');
      const statement=el('p','item-statement',item.statement);
      const citation=el('span','item-refs',' ['+item.references+']');
      statement.append(citation);
      body.append(statement,el('p','rationale',item.rationale));
      const options=el('div','choices');
      options.setAttribute('role','group');
      options.setAttribute('aria-label',item.id+' review response');
      for(const opt of responseLabels) {
        const label=el('label','choice');
        const input=el('input');
        input.type='radio';input.name=item.id;input.value=opt.value;
        input.setAttribute('aria-label',item.id+': '+opt.label);
        input.addEventListener('change',()=>{responses[item.id]=opt.value;update();});
        label.append(input,el('span','',opt.label));
        options.append(label);
      }
      const status=el('div','item-status');
      status.id='status-'+item.id;
      status.setAttribute('aria-live','polite');
      body.append(options,status);
      top.append(body);card.append(top);container.append(card);
    }
    section.append(container);list.append(section);
  }
  const refs=document.getElementById('references');
  for(const reference of checklist.references) {
    refs.append(el('li','',reference.replace(/^\[\d+\]\s*/,'')));
  }
  update();
}
function update(){
  const items=checklist.items;
  const completed=items.filter(i=>responses[i.id]);
  const counts={met:0,'not-met':0,unclear:0,na:0};
  for(const val of Object.values(responses)) counts[val]++;
  const percent=Math.round(100*completed.length/items.length);
  document.getElementById('progress-count').textContent=completed.length+' of '+items.length+' reviewed';
  document.getElementById('progress-percent').textContent=percent+'%';
  document.getElementById('progress-fill').style.width=percent+'%';
  for(const item of items) {
    const status=document.getElementById('status-'+item.id);
    const value=responses[item.id];
    status.textContent=value==='not-met'?'Action needed: verify, revise, or seek guidance.':value==='unclear'?'Unclear: pause and verify before use.':'';
  }
  const stats=document.getElementById('stats');stats.replaceChildren();
  for(const [key,title] of [['met','Met'],['not-met','Not met'],['unclear','Unclear'],['na','N/A']]){
    const box=el('div','stat');box.append(el('b','',String(counts[key])),el('span','',title));stats.append(box);
  }
  const intro=document.getElementById('summary-intro');
  const unresolved=items.filter(i=>!responses[i.id]||responses[i.id]==='not-met'||responses[i.id]==='unclear');
  if(completed.length===0) intro.textContent='Begin reviewing items above. Your summary will update as you go.';
  else if(unresolved.length===0) intro.textContent='All 16 items have been reviewed. Confirm that all applicable statements are met before using the work. N/A items are recorded separately.';
  else intro.textContent=unresolved.length+' item(s) remain unanswered, not met, or unclear. Resolve applicable concerns before using the work.';
  const attention=document.getElementById('attention-list');attention.replaceChildren();
  for(const domain of checklist.domains) {
    const issues=unresolved.filter(i=>i.domain===domain.letter);
    if(!issues.length) continue;
    const group=el('div','attention-group');
    group.append(el('h3','',domain.name+' · '+issues.length+' to review'));
    const ul=el('ul');
    for(const item of issues) {
      const value=responses[item.id];
      const label=value==='not-met'?'Not met':value==='unclear'?'Unclear':'Not answered';
      ul.append(el('li','',item.id+' · '+label+': '+item.statement));
    }
    group.append(ul);attention.append(group);
  }
}
document.getElementById('print-btn').addEventListener('click',()=>window.print());
document.getElementById('reset-btn').addEventListener('click',()=>{
  if(!window.confirm('Clear all responses from this review?')) return;
  for(const key of Object.keys(responses)) delete responses[key];
  document.querySelectorAll('input[type="radio"]').forEach(x=>x.checked=false);
  update();document.getElementById('checklist').scrollIntoView({behavior:'smooth'});
});
fetch('checklist.json').then(r=>{if(!r.ok)throw new Error('Checklist data unavailable');return r.json();})
  .then(data=>{checklist=data;build();})
  .catch(()=>{document.getElementById('domain-list').textContent='Unable to load the checklist. Publish all website files together through GitHub Pages; opening index.html directly from your computer may not work.';});
