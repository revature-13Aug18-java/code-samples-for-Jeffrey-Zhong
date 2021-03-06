import { Component, OnInit } from '@angular/core';
import { Ingredient } from '../../models/Ingredient.model';
import { PantryService } from '../../services/pantry.service';
import { SearchAlgorithmService } from '../../services/search-algorithm.service';
import { FoodCategoryComponent } from '../food-category/food-category.component';
import { AuthService } from '../../services/auth.service';
import { RouterModule, Router } from '@angular/router';
import { HandleArraysService } from '../../services/handle-arrays.service';
@Component({
  selector: 'app-pantry',
  templateUrl: './pantry.component.html',
  styleUrls: ['./pantry.component.css']
})
export class PantryComponent implements OnInit {
  ingredient: Ingredient[] = [];
  stringForDatabase: string;

  private databasestring: string = '';
  constructor(private handleArrays: HandleArraysService,
    private authService: AuthService,
    private foodCategory: FoodCategoryComponent,
    private router: Router, private pantryService: PantryService,
    private searchAlgorithmService: SearchAlgorithmService) { }

  ngOnInit() {

  }

  //splices the ingredient from the users pantry and sends it back to the category fields. Finds the category of the ingredient
  //and sends it to the apporiate array.
  removeItemFromPantry(ingredient: Ingredient) {
    let cat = ingredient.category;
    this.pantryService.ingredient.splice(this.pantryService.ingredient.indexOf(ingredient, 0), 1);
    // if all ingredients includes the ingredient
    // if (this.foodCategory.masterPantry.includes(ingredient)) {

    //  console.log('already exists in on left');
    // } else {
      if(cat == "meats"){
        this.foodCategory.meatIngredients.push(ingredient);
        
      }
      if(cat == "dairy"){
        this.foodCategory.dairyIngredients.push(ingredient);
       
      }
      if(cat == "spices"){
        this.foodCategory.spicesIngredients.push(ingredient);
    
      }
      if(cat == "fruits"){
        this.foodCategory.fruitsIngredients.push(ingredient);
       
      }
      if(cat == "grains"){
        this.foodCategory.starchesIngredients.push(ingredient);
      
      }
      if(cat == "veggies"){
        this.foodCategory.veggiesIngredients.push(ingredient);
    
      }
      // this.foodCategory.masterPantry.push(ingredient);

      // otherwise, compare the category of the element
    //   if (ingredient.category === this.foodCategory.currentCategory) {
    //     // make the visible switch
    //     // this.foodCategory.ingredients.push(ingredient);
    // }  
  // }
  
  }
  //Updates the users Database pantry based on what they have currently in their pantry
  updatePantry(databasestring) {
    this.ingredient = this.pantryService.ingredient;
    this.searchAlgorithmService.searchPantryRecipes(this.ingredient).subscribe(
      data => {
        this.searchAlgorithmService.resultSet = data;
      });
    this.turnArrayToString();

    databasestring = this.databasestring;
  
    this.authService.intermediaryFunctionForUpdatePantry(databasestring).subscribe(data => data);
  }

  // Sorts the pantry
  public sortIngredients() {
    this.ingredient.sort(function (a, b) {
      if (a.name < b.name) {
        return -1;
      }
      if (a.name > b.name) {
        return 1;
      }
      return 0;
    });
  }
  public sortIngredientsType(arr: Ingredient[]) {
    arr.sort(function (a, b) {
      if (a.name < b.name) {
        return -1;
      }
      if (a.name > b.name) {
        return 1;
      }
      return 0;
    });
    return arr;
  }
      //Calls the API calling service to retrieve recipes based on given list of ingredients.
  addSelectionToArray() {
    this.ingredient = this.pantryService.ingredient;
    this.searchAlgorithmService.searchPantryRecipes(this.ingredient).subscribe(
      data => {
        this.searchAlgorithmService.resultSet = data;
      });
    this.turnArrayToString();
    this.router.navigate(['feature']);
  }

  //Turns the current ingredients in the pantry into a comma seperated String to be send to the Database.
  turnArrayToString() {
    this.databasestring = String(this.pantryService.ingredient[0].id);
    for (let i = 1; i < this.pantryService.ingredient.length; i++) {
      this.databasestring = String(this.databasestring + ',' + this.pantryService.ingredient[i].id);
    }
    this.pantryService.userPantryString = this.databasestring;
    this.authService.userPantryString = this.databasestring;
 
    // this.unpackUserPantryArray();
  }

}
