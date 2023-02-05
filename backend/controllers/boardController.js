const asyncHandler = require('express-async-handler')

const Board = require('../models/boardModel')
const User = require('../models/userModel')

// @desc Get Boards
// @route GET /api/boards
// @access Private
const getBoards = asyncHandler(async (req, res) => {
    const boards = await Board.find({ user: req.user.id})

    res.status(200).json(boards)
})

// @desc set Boards
// @route POST /api/boards
// @access Private
const createBoard = asyncHandler(async (req, res) => {
    console.log(req.body.columns)
    if(!req.body) {
        res.status(400)
        throw new Error('Please add board data')
    }

    const board = await Board.create({
        user: req.user.id,
        name: req.body.name,
        columns: req.body.columns || [],
        tasks: req.body.tasks || []
    })

    // const board = await Board.create({
    //     user: req.user.id,
    //     name: "Gman's third(for real) board",
    //     columns: ["Column Yi", "Column er"],
    //     tasks: [
    //         {
    //             title: "first task here",
    //             description: "task description",
    //             subtasks: [
    //                 {
    //                     title: "round it out",
    //                 },
    //                 {
    //                     title: "go for it",
    //                 }
    //             ]
    //         },
    //         {
    //             title: "second task on the board"
    //         }
    //     ]
    // })
    res.status(200).json({ message: 'create board'})
})

// @desc Update Board
// @route PUT /api/boards/:id
// @access Private
const updateBoard = asyncHandler(async (req, res) => {
    const board = await Board.findById(req.params.id)

    if(!board) {
        res.status(400)
        throw new Error('Board not found')
    }

    const user = await User.findById(req.user.id)

    if(!user) {
        res.status(401)
        throw new Error('User not found')
    }

    // Make sure the logged in user matches board user
    if(board.user.toString() !== user.id){
        res.status(401)
        throw new Error('User not authorized')
    }

    const updatedBoard = await Board.findByIdAndUpdate(req.params.id, 
        req.body, {
        new: true,
    })

    res.status(200).json(updatedBoard)
})

// @desc Delete Board
// @route DELETE /api/boards/:id
// @access Private
const deleteBoard = asyncHandler(async (req, res) => {
    const board = await Board.findById(req.params.id)

    if(!board) {
        res.status(400)
        throw new Error('Board not found')
    }

    const user = await User.findById(req.user.id)

    if(!user) {
        res.status(401)
        throw new Error('User not found')
    }
    console.log(board.user, "board user")
    // Make sure the logged in user matches board user
    if(board.user.toString() !== user.id){
        res.status(401)
        throw new Error('User not authorized')
    }

    await board.remove()

    res.status(200).json({ message: `delete board ${req.params.id}`, board: deleted})
})

module.exports = {
    getBoards,
    createBoard,
    updateBoard,
    deleteBoard
}