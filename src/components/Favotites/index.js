import React, { Component } from "react";

import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { logoutUser } from "../../actions/authActions";
import GiphyService from "../../services/giphy";

import { Layout, Menu, Dropdown, Button, Avatar, Spin, Row, Col, Card } from 'antd';
import { EditOutlined, EllipsisOutlined, SettingOutlined, LogoutOutlined } from '@ant-design/icons';
const { Meta } = Card;

const { Header, Content, Footer } = Layout;
const topColResponsiveProps = {
	xs: 24,
	sm: 12,
	md: 12,
	lg: 12,
	xl: 6,
	style: {
		marginBottom: 24,
	},
};

class Dashboard extends Component {

	constructor(props) {
		super(props);
		this.state = {
			giphys: [],
			loading: true
		}
	}

	componentDidMount = () => {
		this.getFavoriteGiphy();
	}

	getFavoriteGiphy = async () => {
		try {
			const user = await GiphyService.getInforUser();
			if (user.success && user.user.favorites.length) {
				const favorites = user.user.favorites.join(',');
				const response = await GiphyService.getFavoriteGiphy(favorites);
				console.log(response);
				this.setState({
					giphys: response.data,
					loading: false
				})
			} else {
				this.setState({ loading: false });
			}
		} catch (error) {
			console.log(error);
		}
	}

	onLogoutClick = () => {
		this.props.logoutUser();
	};

	render() {
		const { user } = this.props.auth;
		const { giphys, loading } = this.state;
		return (
			<Layout className="layout">
				<Header className="site-layout-background" style={{ "background": "white" }}>
					<Dropdown overlay={<Menu>
						<Menu.Item className="d-flex align-items-center">
							<Link to="/dashboard"><span>Trang chủ</span></Link>
						</Menu.Item>
						<Menu.Item className="d-flex align-items-center">
							<Link to="/favorite"><span>Danh sách yêu thích</span></Link>
						</Menu.Item>
						<Menu.Item className="d-flex align-items-center" onClick={this.onLogoutClick}>
							<LogoutOutlined /><span>Đăng xuất</span>
						</Menu.Item>
					</Menu>} placement="bottomCenter">
						<Button
							style={{
								border: 'none',
								height: 64,
								position: "relative",
								float: "right"
							}}
							className="mx-3 d-flex align-items-center"
						>
							<Avatar src={"https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"} />
							<span className="ml-1 text-uppercase ml-2" style={{ textTransform: "uppercase", marginLeft: "10px" }}>Hello, {user.name.split(" ")[0]}</span>
						</Button>
					</Dropdown>
				</Header>
				<Content style={{ padding: '50px 50px 0' }}>
					<div className="site-statistic-demo-card" style={{ background: "white", padding: "20px" }}>
						<Spin spinning={loading}>
							<Row gutter={24} type="flex">
								{giphys.length ? giphys.map(giphy => (
									<Col {...topColResponsiveProps} key={giphy.id}>
										<Card
											cover={
												<img
													style={{ height: "300px", objectFit: "cover" }}
													alt="example"
													src={giphy.images.original.webp || "https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"}
												/>
											}
											actions={[
												<SettingOutlined key="setting" />,
												<EditOutlined key="edit" />,
												<EllipsisOutlined key="ellipsis" />,
											]}
										>
											<Meta
												style={{ height: "130px" }}
												avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
												title={giphy.type || "Card Title"}
												description={giphy.title || "This is the description"}
											/>
										</Card>
									</Col>
								)) : <Col><p style={{ textAlign: "center" }}>Chưa có gif nào trong danh sách yêu thích của bạn</p></Col>}
							</Row>
						</Spin>
					</div>
				</Content>
				<Footer style={{ textAlign: 'center' }}>MERN-GIPHY Created by Trần Văn Tuấn</Footer>
			</Layout>
		);
	}
}

Dashboard.propTypes = {
	logoutUser: PropTypes.func.isRequired,
	auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
	auth: state.auth
});

export default connect(
	mapStateToProps,
	{ logoutUser }
)(Dashboard);
