# モビール問題を解く

1から最大値までの重さの重りを１回ずつ使ってモビールを釣り合わせる、というパズルを解くスクリプトです。

## 使い方

### 準備

```bash
$ cd path/to/balance
$ npm intall
```

### 使い方

```bash
$ ./balance-cli.js -h

  Usage: balance-cli max_value [puzzle]

  Options:

    -h, --help     output usage information
    -V, --version  output the version number

Puzzle example:
  Bar1:2,x|3,x
  Bar2:1,Bar1|3,x
```

最大値の指定は必須です。  
また、puzzleの指定がなかったら、標準入力から入力を受け付けます。どうしても問題が複数行にまたがるので、何かテキストファイルを用意して、リダイレクトするほうが楽です。

### 問題の記述

http://www.geocities.co.jp/Berkeley-Labo/6317/mobile.htm より

![問題1](http://www.geocities.co.jp/Berkeley-Labo/6317/mobile_q1.gif)

この問題の場合、最大値は９で、モビールは左から書いた場合、
```
Bar1:2,x|3,x
Bar2:1,Bar1|3,x
Bar3:4,x/2,x/1,x|2,x
Bar4:4,x|1,x
Bar5:2,Bar3|3,Bar4
Bar6:5,Bar2|4,Bar5
```
となります。

ざっくり、横棒１本につき１行で記述し、
```
Label:Dist.Weight/Dist,Weight....|Dist.Weight....
```
と記述します。
詳細は下記の「[記述ルール](#記述ルール)」をどうぞ。

----

## 作る前に考えたこと

### 問題をどう表記するか？

今までのパズル問題と違って、方形内でのパズルではなく、パズルの大きさの変化がとても大きいのがや悩みどころ。

http://judge.u-aizu.ac.jp/onlinejudge/description.jsp?id=0520 を参考に問題の記述を釣り合っているヨコ棒について、都度記述していく方式をとってみる。

ただ、上記の記述では、ヨコ棒＝行番号としているが、ちょっと可読性悪いので、ヨコ棒自体にも名前をつけられるようにする。

#### 用語を決める

<dl>
<dt>Bar
  <dd>重りがぶら下がっているヨコ棒のこと
<dt>Label
  <dd> Barに割り当てられた名前
<dt>BP
  <dd> Balance Point、Barを吊り下げている縦糸があるところ
<dt>Wegith
  <dd>Barにぶら下がっている重り
<dt>Dist
  <dd>Distance、Weightがぶら下がっている点のBPからの距離
  <dd>Distは、絶対値ではなく、そのBarの中での距離の比で表す
<dt>Load
  <dd>WeightとDistのペア
<dt>多段
  <dd>あるBarにさらに別のBarがぶら下がっている状態
</dl>

#### 記述ルール
   
記述のルールは以下のようにします。

1. １行に１つのBarを記述する
1. Barは、`:`を区切りとして、`Label:Loadのリスト`と書く
1. Label
   1. "x"以外の任意の文字列
   1. １つの問題の中で同じLabelはつけられない
1. Load
   1. 区切りは`,`にして、`Dist,Weight`と書く
   1. Loadのリストは左から並べる
   1. BPの片側にLoadが複数ある場合は、`/`を区切りにする
   1. Loadの値は、Dist x Weightで求められる
1. BPは、`|`で表す
1. 多段のときは、Loadの中のWeightの部分に、下にぶら下がっているBarのLabelを書く


ざっくり、

```
Label:Dist.Weight/Dist,Weight....|Dist.Weight....
```

と記述します。


例えば、

````
            |
+---+---+---+---+---+
|               |   |
x               x   9
````

という問題の場合

```
bar1:3,x|1,x/2,9
```

と記述します。


### 制約を考える

1. BPの両側でそれぞれのLoadの値の合計値が同じになる
1. 多段の場合は、下にぶら下がっているBarのWeightの合計値が、上のLoadのWeightになる
