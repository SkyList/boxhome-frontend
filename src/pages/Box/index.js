import React, { Component } from 'react'
import api, { API_URL } from '../../services/api'
import { MdInsertDriveFile, MdDeleteForever } from 'react-icons/md'
import { distanceInWords } from 'date-fns'
import pt from 'date-fns/locale/pt'
import Dropzone from 'react-dropzone'
import socket from 'socket.io-client'

import logo from '../../assets/logo.svg'
import './styles.css'


export default class Box extends Component {

	state = {
		box: {}
	}

	async componentDidMount() {
		this.subscribeToNewFiles()

		const box = this.props.match.params.id
		const response = await api.get(`boxes/${box}`)

		this.setState({
			box: response.data
		})
	}

	subscribeToNewFiles = () => {
		const box = this.props.match.params.id

		const io = socket(API_URL)

		io.emit('connectRoom', box)

		io.on('file', data => {

			console.log(data)

			this.setState({
				box: {
					...this.state.box,
					files: [data, ...this.state.box.files]
				}
			})
		})
	}

	handleUpload = (files) => {
		files.forEach(file => {
			const data = new FormData()
			const box = this.props.match.params.id

			data.append('file', file)

			api.post(`boxes/${box}/files`, data)
		})
	}

	handleDelete = async (id) => {
		const response = window.confirm('Deseja deletar este arquivo?')
		if (response) {
			const res = await api.delete(`file/${id}`)
			res.data && window.location.reload()

		}
	}

	render() {
		return (
			<div id='box-container'>
				<header>
					<img src={logo} alt='' />
					<h1>{this.state.box.title}</h1>
				</header>

				<Dropzone onDropAccepted={this.handleUpload}>
					{({ getRootProps, getInputProps }) => (
						<div className='upload' {...getRootProps()}>
							<input {...getInputProps()} />
							<p>Arraste arquivos ou clique aqui</p>
						</div>
					)}
				</Dropzone>

				<ul>
					{
						this.state.box.files && this.state.box.files.map(file => (
							<li key={file._id}>
								<a className='fileInfo' href={file.url} target='_blank' rel='noreferrer noopener'>
									<MdInsertDriveFile size={24} color='#a5cfff' />
									<strong>{file.title}</strong>
								</a>
								<div>
									<span>há {distanceInWords(file.createdAt, new Date(), { locale: pt })}</span>
									<button onClick={() => this.handleDelete(file._id)}>
										<MdDeleteForever size={24} color='#a5cfff' />
									</button>
								</div>
							</li>
						))
					}
				</ul>
			</div>
		)
	}
}
