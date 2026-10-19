import test from 'node:test';
import assert from 'node:assert/strict';
import {spotlightGroups,currentMerchant,nextMerchant} from '../assets/js/spotlight.js';
const data={categories:['fish','veg','meat'].map(id=>({id})),stalls:[
 {id:'f1',categoryId:'fish'}, {id:'v1',categoryId:'veg'}, {id:'m1',categoryId:'meat'},
 {id:'f2',categoryId:'fish'}, {id:'v2',categoryId:'veg'}, {id:'v3',categoryId:'veg'},
]};
test('fixed category slots rotate only their own merchants with unequal pool sizes',()=>{
 const groups=spotlightGroups(data);
 assert.deepEqual(groups.map(g=>g.category.id),['fish','veg','meat']);
 let ids=groups.map(g=>currentMerchant(g).id);
 ids=groups.map((g,i)=>nextMerchant(g,ids[i]).id);
 assert.deepEqual(ids,['f2','v2','m1']);
 ids=groups.map((g,i)=>nextMerchant(g,ids[i]).id);
 assert.deepEqual(ids,['f1','v3','m1']);
 assert.deepEqual(groups.map(g=>g.category.id),['fish','veg','meat']);
});
test('reverse, removed merchant and empty publication handled without cross-category fallback',()=>{
 const [fish]=spotlightGroups(data);
 assert.equal(nextMerchant(fish,'f1',-1).id,'f2');
 assert.equal(currentMerchant(fish,'removed').id,'f1');
 assert.equal(nextMerchant(fish,'removed').id,'f1');
 assert.deepEqual(spotlightGroups({...data,stalls:[]}),[]);
});
