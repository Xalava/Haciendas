export function createObjectsAnims(anims){
    anims.create({
        key: 'mineMove',
        frames: anims.generateFrameNumbers('things', { start: 51, end: 51+2 }),
        frameRate: 5,
        repeat: 2,
        hideOnComplete: false // just to remember the option
    })

    anims.create({
        key: 'transaction-valid',
        frames: anims.generateFrameNumbers('things2', { start: 13, end: 14 }),
        frameRate: 1,
        repeat: 3,
        hideOnComplete: false // just to remember the option
    })

    anims.create({
        key: 'transaction-invalid',
        frames: anims.generateFrameNumbers('things2', { start: 14, end: 15 }),
        frameRate: 1,
        repeat: 3,
        hideOnComplete: false // just to remember the option
    })
}

export function createCharAnims(anims, char){
    anims.create({
        key: 'left',
        frames: anims.generateFrameNumbers('characters', { start:char+11, end:char+13 }),
        frameRate: 10,
        repeat: -1
    })
    
    anims.create({
        key: 'idle-left',
        frames: [ { key: 'characters', frame:char+11+1 }],
        frameRate: 1,
        repeat: 0
    })
    anims.create({
        key: 'right',
        frames: anims.generateFrameNumbers('characters', { start:char+11+12, end:char+13+12 }),
        frameRate: 10,
        repeat: -1
    })
    anims.create({
        key: 'idle-right',
        frames: [ { key: 'characters', frame: char+11+12+1 }],
        frameRate: 1,
        repeat: 0
    })
    anims.create({
        key: 'up',
        frames: anims.generateFrameNumbers('characters', { start:char+11+24, end:char+13+24 }),
        frameRate: 10,
        repeat: -1
    })
    anims.create({
        key: 'idle-up',
        frames: [ { key: 'characters', frame:char+12+24 } ],
        
        frameRate: 1,
        repeat: 0
    })
    anims.create({
        key: 'down',
        frames: anims.generateFrameNumbers('characters', { start:char-1, end:char+1 }),
        frameRate: 10,
        repeat: -1
    })
    
    anims.create({
        key: 'idle-down',
        frames: [ { key: 'characters', frame:char } ],
        frameRate: 1,
        repeat: -1
    })
    
    
}
