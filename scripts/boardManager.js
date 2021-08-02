function loadTiles() 
{ 
  const tileSize = 60; 
  for (let line = 0; line < 9; line++) 
  { 
    for (let column = 0; column < 13; column++) 
    { 
    ( 
      (line, column) => { 
                        let count = 0;
                        let theType = parseInt(1 + (Math.random() * 7)); 
                        const tile = $('<img draggable="false" class="tile" data-id="' + line + '-' + column + '" data-index="' + (count++) + '" src="images/stone-' + theType + '.png">')
                              .css ( 
                                     { 
                                       left: (column * tileSize) + 'px', 
                                       top: (line * tileSize) + 'px', 
                                     } 
                                   ); 
                        $('.tileZone') 
                          .append(tile); 
                  } 
           ) (line, column); 
      } 
    } 
} 