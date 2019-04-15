import React, { Component } from 'react';
import api from './../../services/api';

import logo from '../../assets/logo.svg'
import './styles.css'

export default class Main extends Component {

	loading = false
	state = {
		newBox: '',
		progressValue: 0,
	}

	handleSubmit = async (e) => {
		e.preventDefault()

		this.loading = true


		const animateProgress = setInterval(() => {
			this.setState({
				progressValue: this.state.progressValue + 1
			})

			if (this.state.progressValue >= 80) {

				clearInterval(animateProgress)
			}

		}, 10);

		const response = await api.post('boxes', {
			title: this.state.newBox
		})

		await this.setState({
			progressValue: 100
		})

		this.props.history.push(`/box/${response.data._id}`)
	}

	handleInputChange = (e) => {
		this.setState({ newBox: e.target.value })
	}

	render() {
		return (
			<div id='main-container'>
				<form onSubmit={this.handleSubmit}>
					<img src={logo} alt='' />
					<input
						placeholder='criar um box'
						value={this.state.newBox}
						onChange={this.handleInputChange}
						required />
					{
						!this.loading &&
						<button type='submit'>Criar</button>
					}
					{
						this.loading &&
						<progress value={this.state.progressValue} max='100' />
					}
				</form>
			</div>
		)
	}
}
