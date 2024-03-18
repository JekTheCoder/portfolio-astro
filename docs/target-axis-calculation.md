button original image
{
"x": 549.09375,
"y": 65,
"width": 300.40625,
"height": 413.96875,
"top": 65,
"right": 849.5,
"bottom": 478.96875,
"left": 549.09375
}

not resized dialog centered
{
"x": 324.0625,
"y": 296.5,
"width": 284.859375,
"height": 383.984375,
"top": 296.5,
"right": 608.921875,
"bottom": 680.484375,
"left": 324.0625
}

resized centered dialog
{
"x": 316.5,
"y": 282,
"width": 300,
"height": 413,
"top": 282,
"right": 616.5,
"bottom": 695,
"left": 316.5
}

```javascript
// Only considers that the image is the only element within the dialog
afterResize.x = (beforeResize.width - afterResize.width)/2 + beforeResize.x
{
    const fn = (beforeResize, afterResize) => (beforeResize.width - afterResize.width)/2 + beforeResize.x
    console.log(fn({ width: 284, x: 324 }, { width: 300 }))
}

```

not resized centered dialog with other elements
{
"x": 263.140625,
"y": 296.5,
"width": 406.71875,
"height": 384,
"top": 296.5,
"right": 669.859375,
"bottom": 680.5,
"left": 263.140625
}
the other element
{
"x": 548,
"y": 296.5,
"width": 121.859375,
"height": 383.984375,
"top": 296.5,
"right": 669.859375,
"bottom": 680.484375,
"left": 548
}
```
