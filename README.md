# react-cpu

## 2 CPUの挙動を再現する

`src\service\cpu.ts`を作成し、CPUの挙動を模擬した処理を記載する

下記のようなコードを機械語にコンパイルしたものを実行する

```
let sum = 0
for (let i = 1; i <= 10; i++) {
 sum += i
}
console.log(sum)
```

`src\App.tsx`を編集し、作成したcpu.tsの実行結果をHTMLに描画する

![](./image.png)