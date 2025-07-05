[ ] feat(Edit): ctrl-z
[ ] Feat: to be productive, I really need sensible transition values, colors to pick from, etc
[ ] feat: add template elements like rect with no bg, or specific transition pays set. maybe call them components or prefabs from unity
[ ] feat: transparency of bg
[x] fix: prevent keymaps to get fired when typing on a field
[ ] note
[ ] feat (record): audio that plays with the recording. also I need an offset for audio, since the recording may have longer part in the start. would be nice to skip it and easily sync with the slides. good for quickly made videos.
[ ] feat (play): autopassing slides. or some elements. so when an element goes from s1 state to s3 state (those states are defined in slide1 and slide3 accordingly) and we don't wanna interrupt the flow in the slide 2 but still wanna have interactivity in here, I can mark this item as "skip" for slide 2. so it won't apply pay
[ ] feat (record): go I can't skip slides without reassigning
[ ] feat (record): ability to go previous slide while recording and start counting the slide's duration again.
[ ] feat (record): sound for back button for audio cut in audacity
[ ] feat (edit): duplicate layer with C-d, duplicate item with C-c C-v (don't forget to rename)
[ ] BUG (load): loading from selected folder doesn't load images properly
[ ] line from start to cp1 and from end to cp2
[ ] feat (play): autoplay and slide durations.
[ ] feat (voice): record your sound on phone while presenting, match your speed and timing roughly by speaking while looking at slides. bring it to laptop, edit in audacity. cut, crop, effect, add different sounds, easily. then play your edited sound and match your slide durations to the edited sound.
[-] feat (voice): track sync for slide durations. basically, have a phone and start recording here, alongside start your presentation view too. have an offset value to perfect voice/presentation start times. the presentation will take a snapshot of time when you start. when you go to the next slide, it'll just take it's snapshot to get the difference. so now it knows that second slide's voice starts on your track's n-th milliseconds. when you play this presentation back, it'll jump to n when second slides comes in. this allows us to make mistakes, like let's say in 3rd slide, I didn't like my talk and wanted to redo it. so I press back in 3rd slide going to 2nd slide's state, then when I press next and hit 3rd slide, this moment in time is used, the diff from start is taken and this milliseconds will be registered for 3rd slide, all while the single track was recording on the phone. this technique doesn't touch the mistakes on the track, it just skips them. making it very easy to record in a single shot.
[ ] for all elements, similar to layers view
[ ] 3d rotates; also one that rotates 2 axis at once, like the position will button do it for x and y
[x] switches for prev/next slide to rename
[ ] proper save mechanism
[ ] fix: image width
[ ] play functionality. fullscreen view.
[ ] `--r` thing. it goes off the view port height. and it's gonna get messed up when I do fullscreen because it has a hardcoded `calc(100vw - 400px)` and that `400px` does not exist for fullscreen. I probably need different versions of this value, for fullscreen and stuff. also I probably need a more precise definition, cuz you see it's 400 pixel les but we don't count paddings of the wrapper :/ all of them should be considered. also `min(calc(100vh - 300px), calc(100vw - 400px))` kinda stuff can be useful to prevent vertical scrolling when the screen is way too wide. but I probably need to take `16/9` situation into account. if I'm doing it with height, the I need to recalculate it in a way that it's meaningful for width. probably `/ 9 * 16`. or maybe just have a css calc and change it for fullscreen
[ ] auto pass option. when being played, it'll pass the given frame automatically after provided milli seconds. allowing us to make karioqrafik scene sequences
[ ] ensure images load with correct url. for example there might be from an external url, or from folder's
[ ] slide add/remove
[ ] drag n drop from gallery
[ ] move panel changing buttons on top of the panel. they can be scrolled off so space is not a problem
[ ] fix: an element of img with id x gets passed to rect's apply function if the next slide has a rect with id x. a better behavior would be .die and then init a new rect so the name is still usable for new items, unrelated to the id x with different types. so your id continues only with the same id + same type stuff, or maybe can inherit position transitions and stuff
[ ] undo/redo with json.stringify/parse. checkpoint() to save string when edit happened.
[ ] dots instead of previews for now. you can scroll them with mouse scroll. active one has borders. maybe even use their numbers inside those dots.

# done
[x] FIX:! FRACTS AND MAGIC NUMBERS! MOVE THEM TO CSS I'M TIRED OF SEEING THEM IN JS
[x] image loading with drag and drop
[x] loading image back from folderss
[x] add: new slide; save button;
[x] resize handles
[x] if item already exist with the same id on the next slide, `<w>` will just move to the next slide and edit that item's pay instead of copying the exact one. it's literally like just pressing next, but if the item is absent in the slide, it'll add one.
[~] restrict having 2 different types like `rect` and `img` in 2 neighbouring slides with the same id. they will try to apply their own logic to an element that it's not their own (done it for renaming)
[x] ! I think I set src of pay the temporary url for the img. which gets set when the gallery is loaded. instead, let's store them in a `Record<fileName,url>`
[x] transitions and curves

if something else needs asset loading, I'll engineer a better solution for them.
but for simple icon asset loading, it's nice enough and dead simple. I can have a 
simple node script. it wouldn't need to be bundled to work on web hosted platforms,
since it's already a "bundled" thing that includes everything needed in it. it also 
will be fine in bundle processes since it's just js. no hacks or switches.

# ideas

# abandoned

[ ] yes, pseudo pre/current/post states for pay is disgusting. but a pseudo pre slide for a slide is nice. the plate would have a tint for pre/post slides. when you go to that slide, first `pre` would be applied with no transitions, making instant setup, then the actual pay. and when the slide goes somewhere else from it, `post` would get applied and then immidiately the next slide (meaning next slide's `pre`, actual). but to be honest, using actual slides for pre/post for the other slides is more appealing for me.
