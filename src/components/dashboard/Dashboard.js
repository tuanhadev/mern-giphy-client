import React, { Component } from "react";

import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { logoutUser } from "../../actions/authActions";
import GiphyService from "../../services/giphy";
import config from "../../config/index";

import { Layout, Menu, Dropdown, Button, Avatar, Spin, Row, Col, Card, message } from 'antd';
import { PlusOutlined, LogoutOutlined } from '@ant-design/icons';
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

class FavoriteGiphy extends Component {

  constructor(props) {
    super(props);
    this.state = {
      giphys: [],
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
            <Menu.Item className="d-flex align-items-center" onClick={() => { window.open(`${config.domainRocketChat}`, '_blank') }}>
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
      </Layout>
    );
  }
}

FavoriteGiphy.propTypes = {
  logoutUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { logoutUser }
)(FavoriteGiphy);
