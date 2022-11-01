require('dotenv').config();
const User = require('../model/user');
const jwt = require('jsonwebtoken');

const new_account = require('../utility/createaccount')
const {main, transferFrom} = require('./web3');


const find = async (req, res) => {
  const _queries = req.query;
  const user = await User.find(_queries, 'userId profile_image created_at account');
  res.send(user);
};

const signup = async (req, res) => {
  const { userId, password } = req.body;
  console.log(new_account.address);
  console.log(new_account.privateKey);

  // 여기 있는 account 데이터는 추후 이더리움 노드와 연동되면 채워질 부분입니다.
  const user = new User({
    userId,
    password,
    account: new_account.address
  });

  // user 모델에서 mongoose-unique-validator 플러그인을 적용한 채로
  // User Model에서 userID에 unique 옵션을 설정했기 때문에
  // validate() 함수에서 유효성 조사하는 과정 중 이중 아이디를 검출가능
  try {
    const validation = user.validateSync();
    if (validation) throw validation.errors;

    const newDocument = await user.save();
    res.status(201).send(newDocument);
  } catch (errors) {
    res.status(400).send({ errors });
  }
};

const login = async (req, res) => {
  const { userId, password } = req.body;
  console.log(req.cookies)

  try {
    const user = await User.findOne({ userId });
    const result = await user.compare(password, user.password);
    if (!user || !result) throw new Error('Authentication failed. Invalid user or password.');
    else {
      const token = jwt.sign({ userId }, process.env.SECRET, { expiresIn: '1h' });
      res.cookie("token", token, {
        maxAge: 60 * 60 * 1000
      });
      res.json({ userId, token });
    }
  } catch (err) {
    res.status(401).send({ message: err.message });
  }
};

const uploadProfile = async (req, res) => {
  res.status(501).send();
};

const refresh = async (req, res) => {
  //console.log(req)
  const token = req.cookies.token;

  try {
    const data = jwt.verify(token, process.env.SECRET);
    const userId = data.userId;
    const user = await User.findOne({ userId });
    console.log(user)
    
    res.status(200).json({userId, token})
  } catch (err) {
    res.status(401).send(err)
  }


}



module.exports = {
  find,
  signup,
  login,
  uploadProfile,
  refresh
};
