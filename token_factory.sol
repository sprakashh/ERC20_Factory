// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MyToken is ERC20, Ownable {
    constructor(string memory token,string memory symbol) ERC20(token,symbol) {}

    function mint( uint256 amount) public onlyOwner {
        _mint(tx.origin, amount);
    }
}

contract TokenFactory {
    address[] public tokens;
    string[] public tokenNames;
    mapping(string => address) public tokenlist;
    address owner;
   
    constructor(){
        owner = msg.sender;
    }
    
    // function getTokenName() public view returns(string memory)
    // {
    //   MyToken m = new MyToken();
    //   return m.methods.token();

     

    // }


    function getTokenAddresses() public view returns(address[] memory){
        return tokens;
    }
     function getTokenNames() public view returns(string[] memory){
        return tokenNames;
    }
    function createToken(string memory _token,string memory _symbol) public 

    {
    
      require(tokenlist[_token] == address(0), "token name already taken");
      
      MyToken  t = new MyToken(_token,_symbol);
      tokenlist[_token] = address(t);
      tokens.push(address(t));
      tokenNames.push(_token);
        
    }

   function mint(string memory _token, uint256 _amount) public onlyOwner {
        address tokenAddress = tokenlist[_token];
        MyToken token = MyToken(tokenAddress);
        token.mint(_amount);
    }

    function balanceOf(string memory _token,address _X) public view returns(uint){
        address tokenAddress = tokenlist[_token];
        MyToken token = MyToken(tokenAddress);
        return token.balanceOf(_X);
    }

    function transfer(string memory _token,address _to,uint _amount) public{
          address tokenAddress = tokenlist[_token];
        MyToken token = MyToken(tokenAddress);
        token.transfer(_to,_amount);

    }


    modifier onlyOwner{
        require(msg.sender == owner);
        _;
    }

}

