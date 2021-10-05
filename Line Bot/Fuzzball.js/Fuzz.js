fuzz = require('fuzzball')//require 模組

//Simple Ratio
// fuzz.ratio
// console.log(fuzz.ratio("this is A test", "This is a test!"))//100
// console.log(fuzz.ratio("this is A text", "This is a test!"))//93
//系統在默認情況下自動將符號字元移除，以及無視大小寫

//Partial Ratio
// fuzz.partial_ratio
// console.log(fuzz.partial_ratio("test", "testing"))//100
//長字串與短字串互相比對，比較短字串是否為長字串的子字串

//Token Sort Ratio
// fuzz.token_sort_ratio
// console.log(fuzz.ratio("fuzzy wuzzy was a bear", "wuzzy fuzzy was a bear"))//91
// console.log(fuzz.token_sort_ratio("fuzzy Wuzzy was a bear", "wuzzy fuzzy was a bear"))//100
// console.log(fuzz.token_sort_ratio("fuzzy Wuzzy was a bear", "bear was a fuzzy wuzzy"))//100
//兩字串互相比較，會在評分前將每個字標記、排序、再互相組合

//Token Set Ratio
// fuzz.token_set_ratio
// console.log(fuzz.token_sort_ratio("fuzzy was a bear", "fuzzy fuzzy was a bear"))//84
// console.log(fuzz.token_set_ratio("fuzzy was a bear", "fuzzy fuzzy was a bear"))//100
//兩字串互相比較，會在評分前將每個字標記、排序、再互相組合，並且移除重複字元

//Token Similarity Sort Ratio
// fuzz.token_similarity_sort_ratio
// console.log(fuzz.token_sort_ratio('apple cup zebrah horse foo', 'zapple cub horse bebrah bar'))//53
// console.log(fuzz.token_set_ratio('apple cup zebrah horse foo', 'zapple cub horse bebrah bar'))//53
// console.log(fuzz.token_similarity_sort_ratio('apple cup zebrah horse foo', 'zapple cub horse bebrah bar'))//75
// console.log(fuzz.token_set_ratio('apple cup zebrah horse foo', 'zapple cub horse bebrah bar', {sortBySimilarity: true}))//79
//更改排序方式，將原本按照字母順序更改為與較小集合的相識性排序

// Distance
// fuzz.distance
// console.log(fuzz.distance("fuzzy was a bear", "fozzy was a bear"))//1
// console.log(fuzz.distance("fuzzy was a bear", "fozzy fuzzy was a bear"))//6
// console.log(fuzz.distance("fuzzy was a bear", "bear was a fozzy"))//10
//比對字串，取出不同位置的字元個數

// Pre-Processing
// fuzz.full_process
// console.log(fuzz.ratio("this is a test", "this is a test!"))//100
// console.log(fuzz.ratio("this is a test", "this is a test!", {full_process: false}))//97
//除非設置full_process: false，否則系統在默默狀態下會進行預處理，自動將符號字元移除，以及無視大小寫
// console.log(fuzz.full_process("myt^eäXt!"))//myt eäxt
// console.log(fuzz.full_process("myt^eäXt!", {force_ascii: true}))//myt ext

//Collation and Unicode Stuff
// options = {useCollator: true};
// console.log(fuzz.ratio("this is ä test", "this is a test"))//93
// console.log(fuzz.ratio("this is ä test", "this is a test", options))//100
//將UNicode的字元設置成一般字元
// options = {astral: true};
// console.log(fuzz.ratio("ab🐴c", "ab🐴c", options))//100
// console.log(fuzz.ratio("ab🐴c", "ab🐴d", options))//75
//如果字串包含許多超出基本多平面語言的字元，則必須將更改astral:true

//Batch Extract
// With array of strings
    query = "polar bear";//搜尋條件
    choices = ["brown bear", "polar bear", "koala bear"];//搜尋陣列
    results = fuzz.extract(query, choices);//fuzz.extract(query, choices, options);
    console.log(results[0][1])
    var max = 0
    var max_text = 0
    for (let i = 0; i < 3; i++) {
        if (results[i][1] > max) {
            max = results[i][1]
            max_text = results[i][0]
        }
    }
    console.log(max_text)
    // [choice, score, index]
    // [ [ 'polar bear', 100, 1 ],
    // [ 'koala bear', 80, 2 ],
    // [ 'brown bear', 60, 0 ] ]


// With object
    // query = "polar bear";
    // choicesObj = {id1: "brown bear",
    //             id2: "polar bear",
    //             id3: "koala bear"};
    // console.log(results = fuzz.extract(query, choicesObj))
    // // [choice, score, key]
    // [ [ 'polar bear', 100, 'id2' ],
    // [ 'koala bear', 80, 'id3' ],
    // [ 'brown bear', 60, 'id1' ] ]

// Return objects
//     query = "polar bear";
//     choicesObj = {id1: "brown bear",
//                 id2: "polar bear",
//                 id3: "koala bear"};
//     options = {returnObjects: true}
//     console.log(results = fuzz.extract(query, choicesObj, options))
//     [ { choice: 'polar bear', score: 100, key: 'id2' },
//   { choice: 'koala bear', score: 80, key: 'id3' },
//   { choice: 'brown bear', score: 60, key: 'id1' } ]

//Multiple Fields
    // query = {name: "tiger", gender: "female"}
    // choices = [{name: "tigger", gender: "male"},
    //         {name: "lulu", gender: "female"},
    //         {name: "chad ochocinco", gender: "male"}]
    // function myCustomScorer(query, choice, options) {
    //         if (query.gender !== choice.gender) return 2;
    //         else return fuzz.ratio(query.name, choice.name, options);
    // }
    // options = {scorer: myCustomScorer}
    // console.log(results = fuzz.extract(query, choices, options))

//Wildcards
// options = {wildcards: "*x"}; // '*' and 'x' are both wildcards
// console.log(fuzz.ratio('fuzzba*l', 'fuXxball', options))
//利用wildcards:將字元or符號設置為通用字


//Fuzzy Dedupe
// contains_dupes = ['fuzzy wuzzy', 'fuzzy wuzz', 'not a dupe'];
// options = {cutoff: 85, scorer: fuzz.token_set_ratio}
// console.log(fuzz.dedupe(contains_dupes, options))

// // [item, index/key of item in original list]
// [ [ 'fuzzy wuzzy', 0 ],
//   [ 'not a dupe', 2 ] ]