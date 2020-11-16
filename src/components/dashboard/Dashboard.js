import React, { Component } from "react";

import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { logoutUser, loginUser } from "../../actions/authActions";
import GiphyService from "../../services/giphy";
import config from "../../config/index";

import { Layout, Menu, Dropdown, Button, Avatar, Spin, Row, Col, Card, message, Modal, Form, Input, Typography } from 'antd';
import { PlusOutlined, LogoutOutlined } from '@ant-design/icons';
const { Meta } = Card;

const { Header, Content, Footer } = Layout;
const { Text } = Typography;
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

class FavoriteGiphy extends Component {

  constructor(props) {
    super(props);
    this.state = {
      giphys: [],
      visible: false,
      loading: true
    }
  }

  componentDidMount = () => {
    this.getGiphys();
  }

  getGiphys = async () => {
    try {
      const response = await GiphyService.getGiphys();
      this.setState({
        giphys: response.data,
        loading: false
      })
    } catch (error) {
      console.log(error);
    }
  }

  addGif = async (id) => {
    try {
      const data = { favorite: id };
      this.setState({ loading: true });
      const response = await GiphyService.addGif(data);
      this.setState({
        loading: false
      })
      if (response.success) {
        message.success('Thành công');
      } else {
        message.error(response.message);
      }
    } catch (error) {
      console.log(error);
      message.error('Có lỗi xảy ra');
    }
  }

  onLogoutClick = () => {
    this.props.logoutUser();
  };

  handleCancelLogout = () => {
    this.setState({
      visible: false,
    });
  };

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value
    })
  }

  handleOk = async () => {
    const { username, email, name, role, twitter } = this.props.auth.user;
    const { password } = this.state;
    this.setState({ loadingCheckUserExist: true });
    const userData = {
      email,
      password
    };
    const userDataCreateRocket = {
      email,
      password,
      name,
      username,
      customFields: {
        role: role ? role : "student",
        twitter: twitter ? twitter : "example"
      }
    }

    try {
      const response = await GiphyService.checkLoginUser(userData);
      if (response.success) {
        await GiphyService.createUserRocketChat(userDataCreateRocket);
        this.setState({ loadingCheckUserExist: false, visible: false }, () => {
          window.open(`${config.domainRocketChat}`, '_blank')
        })
      } else {
        message.error('Có lỗi xảy ra');
        this.setState({ loadingCheckUserExist: false, visible: false })
      }
    } catch (error) {
      console.log(error);
      message.error('Có lỗi xảy ra');
      this.setState({ loadingCheckUserExist: false, visible: false })
    }
  };

  openChatApp = async () => {
    try {
      const { user } = this.props.auth;
      const response = await GiphyService.getListUserRocketChat();
      const accRocketChat = response.users.find(item => item.username === user.username);
      if (!accRocketChat) {
        this.setState({ visible: true });
      } else {
        window.open(`${config.domainRocketChat}`, '_blank')
      }
    } catch (error) {
      console.log(error);
    }
  }

  render() {
    const { user } = this.props.auth;
    const { giphys, loading, visible, loadingCheckUserExist } = this.state;
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
            <Menu.Item className="d-flex align-items-center" onClick={this.openChatApp}>
              <span>Chat</span>
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
                {giphys.map(giphy => (
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
                        <PlusOutlined key="plus" onClick={() => this.addGif(giphy.id)} />,
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
                ))}
              </Row>
            </Spin>
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>MERN-GIPHY Created by Trần Văn Tuấn</Footer>
        <Modal
          title="Nhập mật khẩu"
          visible={visible}
          onOk={this.handleOk}
          onCancel={this.handleCancelLogout}
          footer={[
            <Button key="back" onClick={this.handleCancelLogout}>
              Hủy
            </Button>,
            <Button key="submit" type="primary" loading={loadingCheckUserExist} onClick={this.handleOk}>
              Xác nhận
            </Button>,
          ]}
        >
          <Form name="nest-messages">
            <Form.Item
              label={<span>Mật khẩu (<Text type="danger">*</Text>)</span>}
            >
              <Input.Password onChange={this.handleChange("password")} />
            </Form.Item>
          </Form>
        </Modal>
      </Layout>
    );
  }
}

FavoriteGiphy.propTypes = {
  loginUser: PropTypes.func.isRequired,
  logoutUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { logoutUser, loginUser }
)(FavoriteGiphy);
