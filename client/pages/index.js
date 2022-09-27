import { useState } from 'react'
import { useEffect } from 'react'
import WrongNetworkMessage from '../components/WrongNetworkMessage'
import ConnectWalletButton from '../components/ConnectWalletButton'
import TodoList from '../components/TodoList'
import { TaskContractAddress } from '../config.js'
import TaskAbi from '../../backend/build/contracts/TaskContract.json'
import { ethers } from 'ethers'

/* 
const tasks = [
  { id: 0, taskText: 'clean', isDeleted: false }, 
  { id: 1, taskText: 'food', isDeleted: false }, 
  { id: 2, taskText: 'water', isDeleted: true }
]
*/

export default function Home() {
  const [correctNetwork, setCorrectNetwork] = useState(false)
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false)
  const [currentAccount, setCurrentAccount] = useState(false)
  const [input, setInput] = useState('')
  const [tasks, setTasks] = useState([])

  useEffect(() => {
    connectWallet()
    getAllTasks()

  }, []);

  const connectWallet = async () => {
    try {
      const { ethereum } = window
      if (!ethereum) {
        console.log('Metamask not detected')
        return
      }
      let chainId = await ethereum.request({ method: 'eth_chainId' })
      console.log('Successfuly connected to chain', chainId)

      const goerliChainId = '0x5'
      if (chainId !== goerliChainId) {
        alert('You are not connected to the goerli testnet!')
        setCorrectNetwork(false)
        return
      }
      else {
        setCorrectNetwork(true)
      }

      const accounts = await ethereum.request({ method: 'eth_requestAccounts' })

      console.log('Account was found', accounts[0])
      setIsUserLoggedIn(true)
      setCurrentAccount(accounts[0])

    } catch (error) {
      console.log(error)
    }
  }

  const getAllTasks = async () => {
    try {
      const { ethereum } = window
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum)
        const signer = provider.getSigner()
        const TaskContract = new ethers.Contract(
          TaskContractAddress,
          TaskAbi.abi,
          signer
        )
        let allTasks = await TaskContract.getMyTasks()
        setTasks(allTasks)
      }
      else {
        console.log('Ethereum object does not exist!')
      }

    } catch (error) {
      console.log(error)
    }

  }

  const addTask = async e => {
    e.preventDefault()

    let task = {
      taskText: input,
      isDeleted: false
    }
    try {
      const { ethereum } = window
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum)
        const signer = provider.getSigner()
        const TaskContract = new ethers.Contract(
          TaskContractAddress,
          TaskAbi.abi,
          signer
        )
        TaskContract.addTask(task.taskText, task.isDeleted)
          .then(res => {
            setTasks([...tasks, task])
            console.log('Task Addition Successful')
          })
          .catch(err => {
            console.log(err)
          })
      }
      else {
        console.log('Ethereum object does not exist!')
      }
    }
    catch (error) {
      concole.log(error)
    }
    setInput('')
  }

  const deleteTask = key => async () => {
    try {
      const { ethereum } = window
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum)
        const signer = provider.getSigner()
        const TaskContract = new ethers.Contract(
          TaskContractAddress,
          TaskAbi.abi,
          signer
        )
        const deleteTaskTx = await TaskContract.deleteTask(key, true)
        console.log('Successfully Deleted!', deleteTaskTx)

        let allTasks = await TaskContract.getMyTasks()
        setTasks(allTasks)
      }
      else {
        console.log('Ethereum does not exist!')
      }

    } catch (error) {
      console.log(error)
    }

  }

  return (
    <div className='bg-[#E0B0FF] h-screen w-screen flex justify-center py-6'>
      {!isUserLoggedIn ? <ConnectWalletButton connectWallet={connectWallet} /> :
        correctNetwork ? <TodoList input={input} tasks={tasks} setInput={setInput} addTask={addTask} deleteTask={deleteTask} /> : <WrongNetworkMessage />}
    </div>
  )
}

