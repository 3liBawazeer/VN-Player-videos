
const getFoldersHome = async (current) => { 
    try {
     
    
    const allvideos = videosAlbums?.filter( im => !im?.filename.endsWith(".mp3") ); // جميع الفيديوهات في ذاكرة الجهاز


    const AllFiles = await RNFetchBlob.fs.lstat(current); // جميع الملفات في المسار الحالي

    // [ فلترة المفات نخلي الملفات الي ما تبدأ بــ . وبس ]
    let filterFolders = AllFiles.filter(item => !item?.filename?.startsWith('.'));

    // [ الملفات الموجودة في المسار الحالي ]
    const currentFolders = filterFolders.filter(item => item.type == 'directory');
   

    // [ الفيديوهات في المسار الحالي ]
    let currentVideos = filterFolders.filter(item => videoExtentions(item?.filename) );
    currentVideos = currentVideos.map((ele)=>{
      if (allvideos.find((one)=> one.path.replace("file://","") == ele.path )) {
        return allvideos.find((one)=> one.path.replace("file://","") == ele.path )
      }
    })
    // ---------------------------- START DANGER 😶‍🌫️ ------------------------- \\

    let foldersWithYourVideos = [];
    // sort folders with videos into it
    currentFolders.map((item, index) => {
      allvideos.map(it => {
        if (it.path.includes(item.path)) {
            // for check is the folder found in (foldersWithYourVideos => array) or not .
            // content of folder of videos [videos]
            const ele = foldersWithYourVideos.find(iem => iem.path == item.path);
            
            if (ele) {

              const index = foldersWithYourVideos.indexOf(ele);
              foldersWithYourVideos[index].content.push(it);
              
            } else {
              foldersWithYourVideos.push({
                path: item.path,
                content: [it],
                filename:item.path.split('/')[item.path.split('/').length - 1],
                lastModified: item.lastModified,
                size: item.size,
                type: item.type,
                folders:[],
                videos:[],
              });
            }
        }
      });
    });

   

    // يجيب عدد الفيديوهات والمفات داخل كل ملف
    const filterVideosAndFolders = foldersWithYourVideos.map((im, ix) => {
      let fol = [];
      let vid = [];
      const videosFilter = im.content.filter((ele, inx) => {
      const group_name = ele.path.replace('file://' + im.path,'').split('/')[1];

        if (
          videoExtentions(group_name) 
        ) {
          vid.push({ ...ele,name: group_name,});
          return (
            videoExtentions(group_name)
          );
        }
      });
      const foldersFilter = im.content.filter((ele, inx) => {
        const group_name = ele.path.replace('file://' + im.path).split('/')[1];
        if (
          !videoExtentions(group_name) &&
          !fol.find((e, x) => e.name == group_name)
        ) {
          fol.push({ ...ele,name: group_name,});
          return (
            videoExtentions(group_name) &&
            !vid.find((e, x) => e.name == group_name)
          );
        }
      });
      return {...im, videos: vid, folders: fol};
    });

    // ---------------------------- END DANGER 😁👌 ------------------------- \\

    // allvideos => جميع فيديوهات الجهاز
    // AllFiles => جميع ملفات المسار الحالي
    // filterFolders => جميع الفيديوهات
    // currentFolders => ملفات المسار الحالي
    // currentVideos => فيديوهات المسار الحالي
    // foldersWithYourVideos => الملفات مع الفيديوهات الي فيها
    // filterVideosAndFolders => الملفات مع الفيديوهات و الملفات الي فيها

    console.log(filterVideosAndFolders);

    } catch (error) {
      console.log(error);
    }
   };


export {getFoldersHome}