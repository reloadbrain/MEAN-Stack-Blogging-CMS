import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PostalService } from '../../services/postal.service';
import { CategoryService } from 'app/services/category.service';
import { FeatureComponent } from '../feature/feature.component';
import { Category } from 'app/models/category.model';
import { Feature } from '../../models/feature.model';

@Component({
    selector: 'app-articles',
    templateUrl: './articles.component.html',
    styleUrls: ['./articles.component.css']
})
export class ArticlesComponent implements OnInit {

    articles: Feature[] = [];

    categories: any[] = [];

    activeCategories: string[] = [];

    filterParams: object;

    maxPosts: number;

    queryCategory: string = null;

    constructor(
        private route: ActivatedRoute,
        private postalService: PostalService,
        private categoryService: CategoryService
    ) { }

    parse(upload: string): string {

        return 'http://localhost:3000' + upload.substring(1);

    }

    ngOnInit() {

        // Initially Set Filter Params
        this.resetFilterParams();

        // Check if query category
        this.getQueryCategory();

        // Get Available Categories
        this.getAllCategories();

        // Count Posts
        this.countPosts();

    }

    getQueryCategory(): void {

        const queryCategory = this.route.queryParams.subscribe(query => {

            if (query.hasOwnProperty('category')) {

                this.queryCategory = query.category;

            } else {

                this.getPosts();

            }

        });

    }

    countPosts(): void {

        this.postalService.countPosts(this.filterParams).subscribe(count => {

            this.maxPosts = count.count;

        });

    }

    getPosts(addByOffset: boolean = false): void {

        const params = this.filterParams;

        params['offset'] = addByOffset ? this.articles.length : 0;

        params['select'] = 'id hero title url date';

        this.postalService.getPosts(params).subscribe(data => {

            if (!addByOffset) {

                this.articles = data;

            } else {

                this.articles = this.articles.concat(data);

            }

        });

    }

    getAllCategories(): void {

        this.categoryService.getCategories().subscribe(data => {

            this.buildSelectableCategories(data);

        });

    }

    buildSelectableCategories(categories: Category[]): void {

        this.categories = categories.map(category => {

            return {

                active: false,

                name: category.name,

            }

        });

        if (this.queryCategory) {

            let index = null;

            this.categories.forEach((category, categoryIndex) => {

                if (category.name === this.queryCategory) {

                    index = categoryIndex;

                }

            });

            if (index !== null) {

                this.selectCategory(index);

            }

        }

    }

    selectCategory(index: number): void {

        this.categories[index].active = !this.categories[index].active;

        this.filterCategories();

    }

    resetFilterParams(): void {

        this.filterParams = {

            active: 'true'

        }

    }

    filterCategories(): void {

        this.activeCategories = this.categories.filter(category => {

            return category.active;

        }).map(category => {

            return category.name;

        });

        if (this.activeCategories.length) {

            this.filterParams['categories'] = this.activeCategories;

        } else {

            this.resetFilterParams();

        }

        // Re Request Count
        this.countPosts();

        // Re Request Posts
        this.getPosts();

    }

}
